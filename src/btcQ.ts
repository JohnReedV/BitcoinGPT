import axios, { AxiosResponse } from 'axios'
import * as fs from 'fs'

interface Config {
    btcHttpProvider: string
    btcRpcUser: string
    btcRpcPassword: string
}

export class BtcQueries {
    conf: Config
    headers: { [key: string]: string }
    rpc: string

    constructor() {
        this.conf = JSON.parse(fs.readFileSync('./conf.json', 'utf8')) as Config
        this.rpc = this.conf.btcHttpProvider
        this.headers = {
            'Content-Type': 'application/json',
            Authorization:
                'Basic ' +
                Buffer.from(
                    this.conf.btcRpcUser + ':' + this.conf.btcRpcPassword
                ).toString('base64'),
        }
    }

    async getBlockHeight(): Promise<number> {
        const getBlockCountPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockcount',
            params: [],
        }
        const getBlockCountResponse: AxiosResponse = await axios.post(
            this.rpc,
            getBlockCountPayload,
            { headers: this.headers }
        )
        return getBlockCountResponse.data.result
    }

    async getBlockHash(blockNumber: number): Promise<string> {
        const getBlockHashPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockhash',
            params: [blockNumber],
        }
        const blockHash: AxiosResponse = await axios.post(
            this.rpc,
            getBlockHashPayload,
            { headers: this.headers }
        )
        return blockHash.data.result
    }

    async getBlock(blockHash: string): Promise<any> {
        const getBlockByHeightPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblock',
            params: [blockHash],
        }
        const getBlockByHeightResponse: AxiosResponse = await axios.post(
            this.rpc,
            getBlockByHeightPayload,
            { headers: this.headers }
        )
        return getBlockByHeightResponse.data.result
    }

    async getRawTX(txHash: string, blockHash: string): Promise<any> {
        const rawTXPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getrawtransaction',
            params: [txHash, true, blockHash],
        }
        const getrawTX: AxiosResponse = await axios.post(
            this.rpc,
            rawTXPayload,
            { headers: this.headers }
        )
        return getrawTX.data.result
    }

    async getDecodedTX(rawTXHexString: string): Promise<any> {
        const getDecodedTXPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'decoderawtransaction',
            params: [rawTXHexString],
        }
        const decodedTX: AxiosResponse = await axios.post(
            this.rpc,
            getDecodedTXPayload,
            { headers: this.headers }
        )
        return decodedTX.data.result
    }

    async getTransactionFromTxId(txid: string): Promise<any> {
        const txPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getrawtransaction',
            params: [txid, true],
        }
        const transaction: AxiosResponse = await axios.post(
            this.rpc,
            txPayload,
            { headers: this.headers }
        )
        return transaction.data.result
    }

    async getChainInfo(): Promise<any> {
        const txPayload = {
            jsonrpc: '1.0',
            id: 'curltext',
            method: 'getblockchaininfo',
            params: [],
        }
        const transaction: AxiosResponse = await axios.post(
            this.rpc,
            txPayload,
            { headers: this.headers }
        )
        return transaction.data.result
    }
}
