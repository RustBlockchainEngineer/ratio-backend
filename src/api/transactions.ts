import { RowDataPacket } from "mysql2";
import { dbcon } from "../models/db";
import { TRANSACTION, TRANSACTION_TYPE } from "../models/model";
import { cacheList } from "../api/cacheList";
import BigNumber from "bignumber.js";

import { PublicKey, TransactionResponse } from "@solana/web3.js";

import { getConnection } from "../utils/utils";

function map_row_vault(row: RowDataPacket): TRANSACTION {
  return {
    transaction_id: row.transaction_id,
    wallet_address_id: row.wallet_address_id,
    address_id: row.address_id,
    symbol: cacheList["_" + row.address_id],
    amount: row.amount,
    fair_price: row.fair_price,
    market_price: row.market_price,
    transaction_type: row.transaction_type,
    created_on: row.created_on,
    sawp_group: row.sawp_group,
    conversion_rate: row.conversion_rate,
    base_address_id: cacheList["_" + row.base_address_id] || "",
    status: row.status,
    borrow_fee: row.borrow_fee,
  };
}
export async function getDetailTransactions(
  wallet_address_id: string,
  vault_address: string,
  callback: (r: TRANSACTION[]) => void
) {
  dbcon.query(
    `SELECT
                    transaction_id,
                    wallet_address_id,
                    address_id,
                    amount,
                    fair_price,
                    market_price,
                    transaction_type,
                    created_on,
                    sawp_group,
                    conversion_rate,
                    base_address_id,
                    status,
                    borrow_fee
                FROM RFDATA.TRANSACTIONS 
                WHERE wallet_address_id = "${wallet_address_id}" 
                        AND vault_address_id = "${vault_address}"
                ORDER BY created_on DESC`,
    async function (err, result) {
      if (err) throw err;
      const rows = <RowDataPacket[]>result;
      let records: TRANSACTION[] = rows.map((row: RowDataPacket) => {
        return map_row_vault(row);
      });

      const connection = await getConnection();

      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        if (
          !record.status ||
          record.status == "Waiting Confirmation ..." ||
          record.status == "Not Confirmed"
        ) {
          const txInfo = await connection.getTransaction(
            record.transaction_id,
            { commitment: "confirmed" }
          );
          const newStatus = !txInfo
            ? "Not Confirmed"
            : !txInfo.meta || txInfo.meta.err
            ? "Failed"
            : "Success";
          let newAmount = record.amount;
          if (newStatus == "Success")
            newAmount = checkTransaction(
              txInfo,
              record.wallet_address_id,
              record.address_id
            ).toString();

          dbcon.query(
            `UPDATE RFDATA.TRANSACTIONS
                    SET status = "${newStatus}", amount = "${newAmount.toString()}"
                    WHERE transaction_id = "${record.transaction_id}"`
          );
          record.status = newStatus;
          record.amount = newAmount.toString();
        }
      }

      callback(records);
    }
  );
}

export async function getTxStatus(
  wallet_address_id: string,
  signature: string,
  callback: (r: Object) => void
) {
  const connection = await getConnection();
  const user = new PublicKey(wallet_address_id);
  const signatures = await connection.getConfirmedSignaturesForAddress2(user);
  const tx = signatures.filter((ele) => {
    return ele.signature == signature;
  });
  try {
    const txInfo = await connection.getTransaction(signature);
    const accounts = txInfo?.transaction.message.accountKeys;
    const err_status = txInfo?.meta?.err;
    const verified = accounts?.filter((ele) => {
      return "_" + ele.toString() in cacheList;
    });
    if (verified)
      callback({
        slot: tx[0].slot,
        status: err_status,
        signature: tx[0].signature,
      });
    else callback({});
  } catch (error) {
    callback({ status: `Failed to get transaction ${signature}` });
  }
}

export async function getTxsignatures(
  wallet_address_id: string,
  callback: (r: string[]) => void
) {
  const connection = await getConnection();
  const user = new PublicKey(wallet_address_id);
  const data = await connection.getConfirmedSignaturesForAddress2(user);

  const txs = data.filter(async (tx) => {
    const txInfo = await connection.getTransaction(tx.signature);
    let validTx = undefined;
    if (txInfo?.transaction?.message?.accountKeys)
      for (let acc of txInfo?.transaction?.message?.accountKeys) {
        validTx = cacheList["_" + acc.toString()];
        if (validTx) break;
      }
    return validTx != undefined;
  });
  const signatures = txs.map((ele) => {
    return ele.signature;
  });
  callback(signatures);
}

const checkTransaction = (
  txInfo: TransactionResponse | null,
  wallet_address_id: string,
  address_id: string
): BigNumber => {
  const tk_pre_balance = txInfo?.meta?.preTokenBalances;
  const tk_post_balance = txInfo?.meta?.postTokenBalances;
  let post_amount = new BigNumber("0");
  let pre_amount = new BigNumber("0");

  if (tk_post_balance) {
    const post = tk_post_balance.filter((ele) => {
      return ele.owner == wallet_address_id && ele.mint == address_id;
    });
    if (post.length > 0) {
      const posttx = post[0];
      if (posttx.uiTokenAmount.uiAmount)
        post_amount = new BigNumber(posttx.uiTokenAmount.uiAmount);
    }
  }

  if (tk_pre_balance) {
    const pre = tk_pre_balance.filter((ele) => {
      return ele.owner == wallet_address_id && ele.mint == address_id;
    });
    if (pre.length > 0) {
      const pretx = pre[0];
      if (pretx.uiTokenAmount.uiAmount)
        pre_amount = new BigNumber(pretx.uiTokenAmount.uiAmount);
    }
  }
  return post_amount.minus(pre_amount);
};

export async function addTransaction(
  wallet_address_id: string,
  data: {
    tx_type: string;
    signature: string;
    address_id: string;
    vault_address: string;
    amount: number;
    fair_price: number;
    market_price: number;
    borrow_fee: number;
  }
) {
  if (!("fair_price" in data)) data["fair_price"] = 0;
  if (!("market_price" in data)) data["market_price"] = 0;

  let ts = Date.now();
  dbcon.query(
    `INSERT INTO RFDATA.TRANSACTIONS(
            transaction_id, 
            wallet_address_id,
            vault_address_id,
            address_id,
            amount,
            fair_price,
            market_price,
            transaction_type,
            description,
            status,
            borrow_fee,
            created_on)
        VALUES (?,?,?,?,?,?,?,?,?,?,FROM_UNIXTIME(? * 0.001))`,
    [
      data.signature,
      wallet_address_id,
      data.vault_address,
      data.address_id,
      data.amount,
      data.fair_price,
      data.market_price,
      data.tx_type,
      "",
      "Waiting Confirmation ...",
      ts,
      data.borrow_fee,
    ]
  );
  return true;
}

export async function updateTxStatus(
  wallet_id: string,
  data: {
    signature: string;
    status: string;
    amount: string;
    fair_price: string;
    market_price: string;
  },
  callback: (r: Object) => void
) {
  if (!("fair_price" in data)) data["fair_price"] = "0";
  if (!("market_price" in data)) data["market_price"] = "0";
  dbcon.query(
    `UPDATE RFDATA.TRANSACTIONS
        SET status = "${data.status}", amount = ${data.amount}, fair_price = ${data.fair_price}, market_price = ${data.market_price} 
        WHERE wallet_address_id = "${wallet_id}" and transaction_id = "${data.signature}"`,
    function (err, result) {
      if (callback) {
        if (err)
          callback({
            status: "failed",
            msg: err,
          });
        else
          callback({
            status: "updated",
          });
      }
    }
  );
  return true;
}
