import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { NFT } from "../models/nft-model";
import { getConnection } from '../utils/utils';

export async function hasRatioNFT(address: string): Promise<boolean>{
    const connection = await getConnection();
    return await getParsedNftAccountsByOwner({
        publicAddress: address,
        connection: connection,
    }).then((result: NFT[]) =>
        result?.some(
        (item) =>
            item.data.name === process.env.RATIO_NFT_NAME &&
            item.data.creators[0].address === process.env.RATIO_NFT_CREATOR_ADDRESS
        )
    );
}