import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  AssembledTransactionOptions,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBG7WIUZPYEPURX2BDT3QUJB77QTY4MAJG32FVSWRG5OMFDOBFDM6OLO",
  }
} as const


export interface State {
  count: u32;
  last_incr: u32;
}

export interface Client {
  /**
   * Construct and simulate a get_state transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Permite obtener la estructura actual almacenada
   */
  get_state: (options?: AssembledTransactionOptions<State>) => Promise<AssembledTransaction<State>>

  /**
   * Construct and simulate a increment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  increment: ({incr}: {incr: u32}, options?: AssembledTransactionOptions<u32>) => Promise<AssembledTransaction<u32>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAABVN0YXRlAAAAAAAAAgAAAAAAAAAFY291bnQAAAAAAAAEAAAAAAAAAAlsYXN0X2luY3IAAAAAAAAE",
        "AAAAAAAAAC9QZXJtaXRlIG9idGVuZXIgbGEgZXN0cnVjdHVyYSBhY3R1YWwgYWxtYWNlbmFkYQAAAAAJZ2V0X3N0YXRlAAAAAAAAAAAAAAEAAAfQAAAABVN0YXRlAAAA",
        "AAAAAAAAAAAAAAAJaW5jcmVtZW50AAAAAAAAAQAAAAAAAAAEaW5jcgAAAAQAAAABAAAABA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_state: this.txFromJSON<State>,
        increment: this.txFromJSON<u32>
  }
}