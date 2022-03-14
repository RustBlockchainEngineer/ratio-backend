import { WhitelistMode } from "../models/model";

export function getWhiteListMode(): WhitelistMode {
  let result:WhitelistMode | undefined;
  if(!process.env.WHITELIST_MODE){
    console.warn("Whitelist mode not set, defaulting to ADMIN_ONLY mode");
    result = WhitelistMode.ADMIN_ONLY;
  }
  else{
    result = WhitelistMode[process.env.WHITELIST_MODE as keyof typeof WhitelistMode];
  }
  if(!result){
    throw "Invalid value set for WHITELIST_MODE env variable";
  }
  return result;
}