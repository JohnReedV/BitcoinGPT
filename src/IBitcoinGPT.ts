export interface DecodedTransaction {
    vout: Vout[];
  }
  
  interface Vout {
    scriptPubKey: ScriptPubKey;
    value: number;
  }
  
  interface ScriptPubKey {
    type: string;
    address: string | null;
  }
  