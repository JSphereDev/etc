import type { Session, Transaction } from "https://deno.land/x/neo4j_lite_client@4.4.1-preview2/mod.ts";    

export { Session, Transaction };
export * as Chai from "https://cdn.skypack.dev/chai@4.3.4?dts";

export type APIContext = {
    tenant: TenantContext,
    request: RequestContext,
    response: ResponseContext,
    db: Session,
    utils: Utils,
    cache: Cache,
    storage: Storage,
    feature: Feature,
    settings: Record<string, unknown>
}

export type TenantContext = {
    id: string,
    tenantId?: string,
    domain: string
}

export type RequestContext = {
    headers: Headers
    cookies: Record<string, string>,
    params: Record<string, string>,
    data: Record<string, unknown>,
    files: Array<RequestFile>
}

export type ResponseContext = {
    redirect: (url: string, status: number) => Response,
    send: (body: Uint8Array|Record<string, unknown>|string, init: Record<string, unknown>) => Response,
    json: (body: Record<string, unknown>, status?: number) => Response,
    text: (body: string, status?: number) => Response,
    html: (body: string, status?: number) => Response,
}

export type Utils = {
    createId: () => string,
    createHash: (value: string) => string,
    compareWithHash: (value: string, hash: string) => boolean,
    decrypt: (data: string) => Promise<string>,
    encrypt: (data: string) => Promise<string>
}

export type Cache = {
    get: (key: string) => Record<string, unknown>,
    set: (key: string, value: string|number|boolean|Record<string, unknown>, expires?: number) => undefined,
    setExpires: (key: string, expires?: number) => undefined,
    remove: (key: string) => undefined
}

export type Storage = {
    create: () => Promise<undefined>,
    put: (key: string, data: Uint8Array) => Promise<undefined>,
    get: (key: string) => Promise<Uint8Array>,
    delete: (key: string) => Promise<undefined>
}

export type Feature = {
    flag: (obj: Record<string, () => undefined>) => undefined
}

export type Headers = {
    append (name: string, value: string): void
    delete (name: string): void
    get (name: string): string | null
    has (name: string): boolean
    set (name: string, value: string): void
    forEach (callbackfn: (
    value: string,
    key: string,
    parent: Headers,
    ) => void, thisArg?: unknown): void
}

export type RequestFile = {
    content: Uint8Array,
    filename: string,
    size: number,
    type: string
}

export interface IUser {
    id: string,
    isAdmin: boolean,
    permissions: Record<string, string>
}

export type TestSuiteContext = {
    run: Run,
    assert: Chai.Assert;
    params: Record<string, unknown>;
}

export type Run = {
    beforeAllTestCasesTask: () => undefined,
    afterAllTestCasesTask: () => undefined,
    beforeEachTestCaseTask: () => undefined,
    afterEachTestCaseTask: () => undefined,
    testCase: (name: string, description: string, tags: Array<string>, fn: () => undefined) => undefined
}

export interface IMessage {
    subject: string,
    data: string|Record<string, unknown>
}

export interface IQuery {
    query?: Record<string, unknown>,
    fields?: string[]
}

