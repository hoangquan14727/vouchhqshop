(function () {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload"))
        return;
    for (const r of document.querySelectorAll('link[rel="modulepreload"]'))
        s(r);
    new MutationObserver(r => {
        for (const i of r)
            if (i.type === "childList")
                for (const o of i.addedNodes)
                    o.tagName === "LINK" && o.rel === "modulepreload" && s(o)
    }
    ).observe(document, {
        childList: !0,
        subtree: !0
    });
    function t(r) {
        const i = {};
        return r.integrity && (i.integrity = r.integrity),
            r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy),
            r.crossOrigin === "use-credentials" ? i.credentials = "include" : r.crossOrigin === "anonymous" ? i.credentials = "omit" : i.credentials = "same-origin",
            i
    }
    function s(r) {
        if (r.ep)
            return;
        r.ep = !0;
        const i = t(r);
        fetch(r.href, i)
    }
}
)();
const et = "modulepreload"
    , tt = function (n) {
        return "/vouchhqshop/" + n
    }
    , $e = {}
    , H = function (e, t, s) {
        let r = Promise.resolve();
        if (t && t.length > 0) {
            document.getElementsByTagName("link");
            const o = document.querySelector("meta[property=csp-nonce]")
                , a = o?.nonce || o?.getAttribute("nonce");
            r = Promise.allSettled(t.map(c => {
                if (c = tt(c),
                    c in $e)
                    return;
                $e[c] = !0;
                const l = c.endsWith(".css")
                    , h = l ? '[rel="stylesheet"]' : "";
                if (document.querySelector(`link[href="${c}"]${h}`))
                    return;
                const u = document.createElement("link");
                if (u.rel = l ? "stylesheet" : et,
                    l || (u.as = "script"),
                    u.crossOrigin = "",
                    u.href = c,
                    a && u.setAttribute("nonce", a),
                    document.head.appendChild(u),
                    l)
                    return new Promise((d, f) => {
                        u.addEventListener("load", d),
                            u.addEventListener("error", () => f(new Error(`Unable to preload CSS for ${c}`)))
                    }
                    )
            }
            ))
        }
        function i(o) {
            const a = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (a.payload = o,
                window.dispatchEvent(a),
                !a.defaultPrevented)
                throw o
        }
        return r.then(o => {
            for (const a of o || [])
                a.status === "rejected" && i(a.reason);
            return e().catch(i)
        }
        )
    }
    , st = n => {
        let e;
        return n ? e = n : typeof fetch > "u" ? e = (...t) => H(async () => {
            const { default: s } = await Promise.resolve().then(() => Z);
            return {
                default: s
            }
        }
            , void 0).then(({ default: s }) => s(...t)) : e = fetch,
            (...t) => e(...t)
    }
    ;
class be extends Error {
    constructor(e, t = "FunctionsError", s) {
        super(e),
            this.name = t,
            this.context = s
    }
}
class rt extends be {
    constructor(e) {
        super("Failed to send a request to the Edge Function", "FunctionsFetchError", e)
    }
}
class it extends be {
    constructor(e) {
        super("Relay Error invoking the Edge Function", "FunctionsRelayError", e)
    }
}
class nt extends be {
    constructor(e) {
        super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e)
    }
}
var ot = function (n, e, t, s) {
    function r(i) {
        return i instanceof t ? i : new t(function (o) {
            o(i)
        }
        )
    }
    return new (t || (t = Promise))(function (i, o) {
        function a(h) {
            try {
                l(s.next(h))
            } catch (u) {
                o(u)
            }
        }
        function c(h) {
            try {
                l(s.throw(h))
            } catch (u) {
                o(u)
            }
        }
        function l(h) {
            h.done ? i(h.value) : r(h.value).then(a, c)
        }
        l((s = s.apply(n, e || [])).next())
    }
    )
};
class at {
    constructor(e, { headers: t = {}, customFetch: s } = {}) {
        this.url = e,
            this.headers = t,
            this.fetch = st(s)
    }
    setAuth(e) {
        this.headers.Authorization = `Bearer ${e}`
    }
    invoke(e, t = {}) {
        var s;
        return ot(this, void 0, void 0, function* () {
            try {
                const { headers: r, method: i, body: o } = t;
                let a = {}, c;
                o && (r && !Object.prototype.hasOwnProperty.call(r, "Content-Type") || !r) && (typeof Blob < "u" && o instanceof Blob || o instanceof ArrayBuffer ? (a["Content-Type"] = "application/octet-stream",
                    c = o) : typeof o == "string" ? (a["Content-Type"] = "text/plain",
                        c = o) : typeof FormData < "u" && o instanceof FormData ? c = o : (a["Content-Type"] = "application/json",
                            c = JSON.stringify(o)));
                const l = yield this.fetch(`${this.url}/${e}`, {
                    method: i || "POST",
                    headers: Object.assign(Object.assign(Object.assign({}, a), this.headers), r),
                    body: c
                }).catch(f => {
                    throw new rt(f)
                }
                )
                    , h = l.headers.get("x-relay-error");
                if (h && h === "true")
                    throw new it(l);
                if (!l.ok)
                    throw new nt(l);
                let u = ((s = l.headers.get("Content-Type")) !== null && s !== void 0 ? s : "text/plain").split(";")[0].trim(), d;
                return u === "application/json" ? d = yield l.json() : u === "application/octet-stream" ? d = yield l.blob() : u === "multipart/form-data" ? d = yield l.formData() : d = yield l.text(),
                {
                    data: d,
                    error: null
                }
            } catch (r) {
                return {
                    data: null,
                    error: r
                }
            }
        })
    }
}
var ct = function () {
    if (typeof self < "u")
        return self;
    if (typeof window < "u")
        return window;
    if (typeof global < "u")
        return global;
    throw new Error("unable to locate global object")
}
    , K = ct();
const lt = K.fetch
    , ke = K.fetch.bind(K)
    , Je = K.Headers
    , ht = K.Request
    , ut = K.Response
    , Z = Object.freeze(Object.defineProperty({
        __proto__: null,
        Headers: Je,
        Request: ht,
        Response: ut,
        default: ke,
        fetch: lt
    }, Symbol.toStringTag, {
        value: "Module"
    }));
class dt extends Error {
    constructor(e) {
        super(e.message),
            this.name = "PostgrestError",
            this.details = e.details,
            this.hint = e.hint,
            this.code = e.code
    }
}
class ft {
    constructor(e) {
        this.shouldThrowOnError = !1,
            this.method = e.method,
            this.url = e.url,
            this.headers = e.headers,
            this.schema = e.schema,
            this.body = e.body,
            this.shouldThrowOnError = e.shouldThrowOnError,
            this.signal = e.signal,
            this.isMaybeSingle = e.isMaybeSingle,
            e.fetch ? this.fetch = e.fetch : typeof fetch > "u" ? this.fetch = ke : this.fetch = fetch
    }
    throwOnError() {
        return this.shouldThrowOnError = !0,
            this
    }
    then(e, t) {
        this.schema === void 0 || (["GET", "HEAD"].includes(this.method) ? this.headers["Accept-Profile"] = this.schema : this.headers["Content-Profile"] = this.schema),
            this.method !== "GET" && this.method !== "HEAD" && (this.headers["Content-Type"] = "application/json");
        const s = this.fetch;
        let r = s(this.url.toString(), {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.body),
            signal: this.signal
        }).then(async i => {
            var o, a, c;
            let l = null
                , h = null
                , u = null
                , d = i.status
                , f = i.statusText;
            if (i.ok) {
                if (this.method !== "HEAD") {
                    const k = await i.text();
                    k === "" || (this.headers.Accept === "text/csv" || this.headers.Accept && this.headers.Accept.includes("application/vnd.pgrst.plan+text") ? h = k : h = JSON.parse(k))
                }
                const g = (o = this.headers.Prefer) === null || o === void 0 ? void 0 : o.match(/count=(exact|planned|estimated)/)
                    , _ = (a = i.headers.get("content-range")) === null || a === void 0 ? void 0 : a.split("/");
                g && _ && _.length > 1 && (u = parseInt(_[1])),
                    this.isMaybeSingle && this.method === "GET" && Array.isArray(h) && (h.length > 1 ? (l = {
                        code: "PGRST116",
                        details: `Results contain ${h.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                        hint: null,
                        message: "JSON object requested, multiple (or no) rows returned"
                    },
                        h = null,
                        u = null,
                        d = 406,
                        f = "Not Acceptable") : h.length === 1 ? h = h[0] : h = null)
            } else {
                const g = await i.text();
                try {
                    l = JSON.parse(g),
                        Array.isArray(l) && i.status === 404 && (h = [],
                            l = null,
                            d = 200,
                            f = "OK")
                } catch {
                    i.status === 404 && g === "" ? (d = 204,
                        f = "No Content") : l = {
                            message: g
                        }
                }
                if (l && this.isMaybeSingle && (!((c = l?.details) === null || c === void 0) && c.includes("0 rows")) && (l = null,
                    d = 200,
                    f = "OK"),
                    l && this.shouldThrowOnError)
                    throw new dt(l)
            }
            return {
                error: l,
                data: h,
                count: u,
                status: d,
                statusText: f
            }
        }
        );
        return this.shouldThrowOnError || (r = r.catch(i => {
            var o, a, c;
            return {
                error: {
                    message: `${(o = i?.name) !== null && o !== void 0 ? o : "FetchError"}: ${i?.message}`,
                    details: `${(a = i?.stack) !== null && a !== void 0 ? a : ""}`,
                    hint: "",
                    code: `${(c = i?.code) !== null && c !== void 0 ? c : ""}`
                },
                data: null,
                count: null,
                status: 0,
                statusText: ""
            }
        }
        )),
            r.then(e, t)
    }
}
class gt extends ft {
    select(e) {
        let t = !1;
        const s = (e ?? "*").split("").map(r => /\s/.test(r) && !t ? "" : (r === '"' && (t = !t),
            r)).join("");
        return this.url.searchParams.set("select", s),
            this.headers.Prefer && (this.headers.Prefer += ","),
            this.headers.Prefer += "return=representation",
            this
    }
    order(e, { ascending: t = !0, nullsFirst: s, foreignTable: r, referencedTable: i = r } = {}) {
        const o = i ? `${i}.order` : "order"
            , a = this.url.searchParams.get(o);
        return this.url.searchParams.set(o, `${a ? `${a},` : ""}${e}.${t ? "asc" : "desc"}${s === void 0 ? "" : s ? ".nullsfirst" : ".nullslast"}`),
            this
    }
    limit(e, { foreignTable: t, referencedTable: s = t } = {}) {
        const r = typeof s > "u" ? "limit" : `${s}.limit`;
        return this.url.searchParams.set(r, `${e}`),
            this
    }
    range(e, t, { foreignTable: s, referencedTable: r = s } = {}) {
        const i = typeof r > "u" ? "offset" : `${r}.offset`
            , o = typeof r > "u" ? "limit" : `${r}.limit`;
        return this.url.searchParams.set(i, `${e}`),
            this.url.searchParams.set(o, `${t - e + 1}`),
            this
    }
    abortSignal(e) {
        return this.signal = e,
            this
    }
    single() {
        return this.headers.Accept = "application/vnd.pgrst.object+json",
            this
    }
    maybeSingle() {
        return this.method === "GET" ? this.headers.Accept = "application/json" : this.headers.Accept = "application/vnd.pgrst.object+json",
            this.isMaybeSingle = !0,
            this
    }
    csv() {
        return this.headers.Accept = "text/csv",
            this
    }
    geojson() {
        return this.headers.Accept = "application/geo+json",
            this
    }
    explain({ analyze: e = !1, verbose: t = !1, settings: s = !1, buffers: r = !1, wal: i = !1, format: o = "text" } = {}) {
        var a;
        const c = [e ? "analyze" : null, t ? "verbose" : null, s ? "settings" : null, r ? "buffers" : null, i ? "wal" : null].filter(Boolean).join("|")
            , l = (a = this.headers.Accept) !== null && a !== void 0 ? a : "application/json";
        return this.headers.Accept = `application/vnd.pgrst.plan+${o}; for="${l}"; options=${c};`,
            o === "json" ? this : this
    }
    rollback() {
        var e;
        return ((e = this.headers.Prefer) !== null && e !== void 0 ? e : "").trim().length > 0 ? this.headers.Prefer += ",tx=rollback" : this.headers.Prefer = "tx=rollback",
            this
    }
    returns() {
        return this
    }
}
class M extends gt {
    eq(e, t) {
        return this.url.searchParams.append(e, `eq.${t}`),
            this
    }
    neq(e, t) {
        return this.url.searchParams.append(e, `neq.${t}`),
            this
    }
    gt(e, t) {
        return this.url.searchParams.append(e, `gt.${t}`),
            this
    }
    gte(e, t) {
        return this.url.searchParams.append(e, `gte.${t}`),
            this
    }
    lt(e, t) {
        return this.url.searchParams.append(e, `lt.${t}`),
            this
    }
    lte(e, t) {
        return this.url.searchParams.append(e, `lte.${t}`),
            this
    }
    like(e, t) {
        return this.url.searchParams.append(e, `like.${t}`),
            this
    }
    likeAllOf(e, t) {
        return this.url.searchParams.append(e, `like(all).{${t.join(",")}}`),
            this
    }
    likeAnyOf(e, t) {
        return this.url.searchParams.append(e, `like(any).{${t.join(",")}}`),
            this
    }
    ilike(e, t) {
        return this.url.searchParams.append(e, `ilike.${t}`),
            this
    }
    ilikeAllOf(e, t) {
        return this.url.searchParams.append(e, `ilike(all).{${t.join(",")}}`),
            this
    }
    ilikeAnyOf(e, t) {
        return this.url.searchParams.append(e, `ilike(any).{${t.join(",")}}`),
            this
    }
    is(e, t) {
        return this.url.searchParams.append(e, `is.${t}`),
            this
    }
    in(e, t) {
        const s = t.map(r => typeof r == "string" && new RegExp("[,()]").test(r) ? `"${r}"` : `${r}`).join(",");
        return this.url.searchParams.append(e, `in.(${s})`),
            this
    }
    contains(e, t) {
        return typeof t == "string" ? this.url.searchParams.append(e, `cs.${t}`) : Array.isArray(t) ? this.url.searchParams.append(e, `cs.{${t.join(",")}}`) : this.url.searchParams.append(e, `cs.${JSON.stringify(t)}`),
            this
    }
    containedBy(e, t) {
        return typeof t == "string" ? this.url.searchParams.append(e, `cd.${t}`) : Array.isArray(t) ? this.url.searchParams.append(e, `cd.{${t.join(",")}}`) : this.url.searchParams.append(e, `cd.${JSON.stringify(t)}`),
            this
    }
    rangeGt(e, t) {
        return this.url.searchParams.append(e, `sr.${t}`),
            this
    }
    rangeGte(e, t) {
        return this.url.searchParams.append(e, `nxl.${t}`),
            this
    }
    rangeLt(e, t) {
        return this.url.searchParams.append(e, `sl.${t}`),
            this
    }
    rangeLte(e, t) {
        return this.url.searchParams.append(e, `nxr.${t}`),
            this
    }
    rangeAdjacent(e, t) {
        return this.url.searchParams.append(e, `adj.${t}`),
            this
    }
    overlaps(e, t) {
        return typeof t == "string" ? this.url.searchParams.append(e, `ov.${t}`) : this.url.searchParams.append(e, `ov.{${t.join(",")}}`),
            this
    }
    textSearch(e, t, { config: s, type: r } = {}) {
        let i = "";
        r === "plain" ? i = "pl" : r === "phrase" ? i = "ph" : r === "websearch" && (i = "w");
        const o = s === void 0 ? "" : `(${s})`;
        return this.url.searchParams.append(e, `${i}fts${o}.${t}`),
            this
    }
    match(e) {
        return Object.entries(e).forEach(([t, s]) => {
            this.url.searchParams.append(t, `eq.${s}`)
        }
        ),
            this
    }
    not(e, t, s) {
        return this.url.searchParams.append(e, `not.${t}.${s}`),
            this
    }
    or(e, { foreignTable: t, referencedTable: s = t } = {}) {
        const r = s ? `${s}.or` : "or";
        return this.url.searchParams.append(r, `(${e})`),
            this
    }
    filter(e, t, s) {
        return this.url.searchParams.append(e, `${t}.${s}`),
            this
    }
}
class pt {
    constructor(e, { headers: t = {}, schema: s, fetch: r }) {
        this.url = e,
            this.headers = t,
            this.schema = s,
            this.fetch = r
    }
    select(e, { head: t = !1, count: s } = {}) {
        const r = t ? "HEAD" : "GET";
        let i = !1;
        const o = (e ?? "*").split("").map(a => /\s/.test(a) && !i ? "" : (a === '"' && (i = !i),
            a)).join("");
        return this.url.searchParams.set("select", o),
            s && (this.headers.Prefer = `count=${s}`),
            new M({
                method: r,
                url: this.url,
                headers: this.headers,
                schema: this.schema,
                fetch: this.fetch,
                allowEmpty: !1
            })
    }
    insert(e, { count: t, defaultToNull: s = !0 } = {}) {
        const r = "POST"
            , i = [];
        if (this.headers.Prefer && i.push(this.headers.Prefer),
            t && i.push(`count=${t}`),
            s || i.push("missing=default"),
            this.headers.Prefer = i.join(","),
            Array.isArray(e)) {
            const o = e.reduce((a, c) => a.concat(Object.keys(c)), []);
            if (o.length > 0) {
                const a = [...new Set(o)].map(c => `"${c}"`);
                this.url.searchParams.set("columns", a.join(","))
            }
        }
        return new M({
            method: r,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: e,
            fetch: this.fetch,
            allowEmpty: !1
        })
    }
    upsert(e, { onConflict: t, ignoreDuplicates: s = !1, count: r, defaultToNull: i = !0 } = {}) {
        const o = "POST"
            , a = [`resolution=${s ? "ignore" : "merge"}-duplicates`];
        if (t !== void 0 && this.url.searchParams.set("on_conflict", t),
            this.headers.Prefer && a.push(this.headers.Prefer),
            r && a.push(`count=${r}`),
            i || a.push("missing=default"),
            this.headers.Prefer = a.join(","),
            Array.isArray(e)) {
            const c = e.reduce((l, h) => l.concat(Object.keys(h)), []);
            if (c.length > 0) {
                const l = [...new Set(c)].map(h => `"${h}"`);
                this.url.searchParams.set("columns", l.join(","))
            }
        }
        return new M({
            method: o,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: e,
            fetch: this.fetch,
            allowEmpty: !1
        })
    }
    update(e, { count: t } = {}) {
        const s = "PATCH"
            , r = [];
        return this.headers.Prefer && r.push(this.headers.Prefer),
            t && r.push(`count=${t}`),
            this.headers.Prefer = r.join(","),
            new M({
                method: s,
                url: this.url,
                headers: this.headers,
                schema: this.schema,
                body: e,
                fetch: this.fetch,
                allowEmpty: !1
            })
    }
    delete({ count: e } = {}) {
        const t = "DELETE"
            , s = [];
        return e && s.push(`count=${e}`),
            this.headers.Prefer && s.unshift(this.headers.Prefer),
            this.headers.Prefer = s.join(","),
            new M({
                method: t,
                url: this.url,
                headers: this.headers,
                schema: this.schema,
                fetch: this.fetch,
                allowEmpty: !1
            })
    }
}
const mt = "1.9.2"
    , vt = {
        "X-Client-Info": `postgrest-js/${mt}`
    };
class Ee {
    constructor(e, { headers: t = {}, schema: s, fetch: r } = {}) {
        this.url = e,
            this.headers = Object.assign(Object.assign({}, vt), t),
            this.schemaName = s,
            this.fetch = r
    }
    from(e) {
        const t = new URL(`${this.url}/${e}`);
        return new pt(t, {
            headers: Object.assign({}, this.headers),
            schema: this.schemaName,
            fetch: this.fetch
        })
    }
    schema(e) {
        return new Ee(this.url, {
            headers: this.headers,
            schema: e,
            fetch: this.fetch
        })
    }
    rpc(e, t = {}, { head: s = !1, count: r } = {}) {
        let i;
        const o = new URL(`${this.url}/rpc/${e}`);
        let a;
        s ? (i = "HEAD",
            Object.entries(t).forEach(([l, h]) => {
                o.searchParams.append(l, `${h}`)
            }
            )) : (i = "POST",
                a = t);
        const c = Object.assign({}, this.headers);
        return r && (c.Prefer = `count=${r}`),
            new M({
                method: i,
                url: o,
                headers: c,
                schema: this.schemaName,
                body: a,
                fetch: this.fetch,
                allowEmpty: !1
            })
    }
}
const _t = "2.9.3"
    , yt = {
        "X-Client-Info": `realtime-js/${_t}`
    }
    , wt = "1.0.0"
    , He = 1e4
    , bt = 1e3;
var J;
(function (n) {
    n[n.connecting = 0] = "connecting",
        n[n.open = 1] = "open",
        n[n.closing = 2] = "closing",
        n[n.closed = 3] = "closed"
}
)(J || (J = {}));
var E;
(function (n) {
    n.closed = "closed",
        n.errored = "errored",
        n.joined = "joined",
        n.joining = "joining",
        n.leaving = "leaving"
}
)(E || (E = {}));
var O;
(function (n) {
    n.close = "phx_close",
        n.error = "phx_error",
        n.join = "phx_join",
        n.reply = "phx_reply",
        n.leave = "phx_leave",
        n.access_token = "access_token"
}
)(O || (O = {}));
var fe;
(function (n) {
    n.websocket = "websocket"
}
)(fe || (fe = {}));
var I;
(function (n) {
    n.Connecting = "connecting",
        n.Open = "open",
        n.Closing = "closing",
        n.Closed = "closed"
}
)(I || (I = {}));
class Ke {
    constructor(e, t) {
        this.callback = e,
            this.timerCalc = t,
            this.timer = void 0,
            this.tries = 0,
            this.callback = e,
            this.timerCalc = t
    }
    reset() {
        this.tries = 0,
            clearTimeout(this.timer)
    }
    scheduleTimeout() {
        clearTimeout(this.timer),
            this.timer = setTimeout(() => {
                this.tries = this.tries + 1,
                    this.callback()
            }
                , this.timerCalc(this.tries + 1))
    }
}
class kt {
    constructor() {
        this.HEADER_LENGTH = 1
    }
    decode(e, t) {
        return e.constructor === ArrayBuffer ? t(this._binaryDecode(e)) : t(typeof e == "string" ? JSON.parse(e) : {})
    }
    _binaryDecode(e) {
        const t = new DataView(e)
            , s = new TextDecoder;
        return this._decodeBroadcast(e, t, s)
    }
    _decodeBroadcast(e, t, s) {
        const r = t.getUint8(1)
            , i = t.getUint8(2);
        let o = this.HEADER_LENGTH + 2;
        const a = s.decode(e.slice(o, o + r));
        o = o + r;
        const c = s.decode(e.slice(o, o + i));
        o = o + i;
        const l = JSON.parse(s.decode(e.slice(o, e.byteLength)));
        return {
            ref: null,
            topic: a,
            event: c,
            payload: l
        }
    }
}
class ae {
    constructor(e, t, s = {}, r = He) {
        this.channel = e,
            this.event = t,
            this.payload = s,
            this.timeout = r,
            this.sent = !1,
            this.timeoutTimer = void 0,
            this.ref = "",
            this.receivedResp = null,
            this.recHooks = [],
            this.refEvent = null
    }
    resend(e) {
        this.timeout = e,
            this._cancelRefEvent(),
            this.ref = "",
            this.refEvent = null,
            this.receivedResp = null,
            this.sent = !1,
            this.send()
    }
    send() {
        this._hasReceived("timeout") || (this.startTimeout(),
            this.sent = !0,
            this.channel.socket.push({
                topic: this.channel.topic,
                event: this.event,
                payload: this.payload,
                ref: this.ref,
                join_ref: this.channel._joinRef()
            }))
    }
    updatePayload(e) {
        this.payload = Object.assign(Object.assign({}, this.payload), e)
    }
    receive(e, t) {
        var s;
        return this._hasReceived(e) && t((s = this.receivedResp) === null || s === void 0 ? void 0 : s.response),
            this.recHooks.push({
                status: e,
                callback: t
            }),
            this
    }
    startTimeout() {
        if (this.timeoutTimer)
            return;
        this.ref = this.channel.socket._makeRef(),
            this.refEvent = this.channel._replyEventName(this.ref);
        const e = t => {
            this._cancelRefEvent(),
                this._cancelTimeout(),
                this.receivedResp = t,
                this._matchReceive(t)
        }
            ;
        this.channel._on(this.refEvent, {}, e),
            this.timeoutTimer = setTimeout(() => {
                this.trigger("timeout", {})
            }
                , this.timeout)
    }
    trigger(e, t) {
        this.refEvent && this.channel._trigger(this.refEvent, {
            status: e,
            response: t
        })
    }
    destroy() {
        this._cancelRefEvent(),
            this._cancelTimeout()
    }
    _cancelRefEvent() {
        this.refEvent && this.channel._off(this.refEvent, {})
    }
    _cancelTimeout() {
        clearTimeout(this.timeoutTimer),
            this.timeoutTimer = void 0
    }
    _matchReceive({ status: e, response: t }) {
        this.recHooks.filter(s => s.status === e).forEach(s => s.callback(t))
    }
    _hasReceived(e) {
        return this.receivedResp && this.receivedResp.status === e
    }
}
var je;
(function (n) {
    n.SYNC = "sync",
        n.JOIN = "join",
        n.LEAVE = "leave"
}
)(je || (je = {}));
class Y {
    constructor(e, t) {
        this.channel = e,
            this.state = {},
            this.pendingDiffs = [],
            this.joinRef = null,
            this.caller = {
                onJoin: () => { }
                ,
                onLeave: () => { }
                ,
                onSync: () => { }
            };
        const s = t?.events || {
            state: "presence_state",
            diff: "presence_diff"
        };
        this.channel._on(s.state, {}, r => {
            const { onJoin: i, onLeave: o, onSync: a } = this.caller;
            this.joinRef = this.channel._joinRef(),
                this.state = Y.syncState(this.state, r, i, o),
                this.pendingDiffs.forEach(c => {
                    this.state = Y.syncDiff(this.state, c, i, o)
                }
                ),
                this.pendingDiffs = [],
                a()
        }
        ),
            this.channel._on(s.diff, {}, r => {
                const { onJoin: i, onLeave: o, onSync: a } = this.caller;
                this.inPendingSyncState() ? this.pendingDiffs.push(r) : (this.state = Y.syncDiff(this.state, r, i, o),
                    a())
            }
            ),
            this.onJoin((r, i, o) => {
                this.channel._trigger("presence", {
                    event: "join",
                    key: r,
                    currentPresences: i,
                    newPresences: o
                })
            }
            ),
            this.onLeave((r, i, o) => {
                this.channel._trigger("presence", {
                    event: "leave",
                    key: r,
                    currentPresences: i,
                    leftPresences: o
                })
            }
            ),
            this.onSync(() => {
                this.channel._trigger("presence", {
                    event: "sync"
                })
            }
            )
    }
    static syncState(e, t, s, r) {
        const i = this.cloneDeep(e)
            , o = this.transformState(t)
            , a = {}
            , c = {};
        return this.map(i, (l, h) => {
            o[l] || (c[l] = h)
        }
        ),
            this.map(o, (l, h) => {
                const u = i[l];
                if (u) {
                    const d = h.map(_ => _.presence_ref)
                        , f = u.map(_ => _.presence_ref)
                        , v = h.filter(_ => f.indexOf(_.presence_ref) < 0)
                        , g = u.filter(_ => d.indexOf(_.presence_ref) < 0);
                    v.length > 0 && (a[l] = v),
                        g.length > 0 && (c[l] = g)
                } else
                    a[l] = h
            }
            ),
            this.syncDiff(i, {
                joins: a,
                leaves: c
            }, s, r)
    }
    static syncDiff(e, t, s, r) {
        const { joins: i, leaves: o } = {
            joins: this.transformState(t.joins),
            leaves: this.transformState(t.leaves)
        };
        return s || (s = () => { }
        ),
            r || (r = () => { }
            ),
            this.map(i, (a, c) => {
                var l;
                const h = (l = e[a]) !== null && l !== void 0 ? l : [];
                if (e[a] = this.cloneDeep(c),
                    h.length > 0) {
                    const u = e[a].map(f => f.presence_ref)
                        , d = h.filter(f => u.indexOf(f.presence_ref) < 0);
                    e[a].unshift(...d)
                }
                s(a, h, c)
            }
            ),
            this.map(o, (a, c) => {
                let l = e[a];
                if (!l)
                    return;
                const h = c.map(u => u.presence_ref);
                l = l.filter(u => h.indexOf(u.presence_ref) < 0),
                    e[a] = l,
                    r(a, l, c),
                    l.length === 0 && delete e[a]
            }
            ),
            e
    }
    static map(e, t) {
        return Object.getOwnPropertyNames(e).map(s => t(s, e[s]))
    }
    static transformState(e) {
        return e = this.cloneDeep(e),
            Object.getOwnPropertyNames(e).reduce((t, s) => {
                const r = e[s];
                return "metas" in r ? t[s] = r.metas.map(i => (i.presence_ref = i.phx_ref,
                    delete i.phx_ref,
                    delete i.phx_ref_prev,
                    i)) : t[s] = r,
                    t
            }
                , {})
    }
    static cloneDeep(e) {
        return JSON.parse(JSON.stringify(e))
    }
    onJoin(e) {
        this.caller.onJoin = e
    }
    onLeave(e) {
        this.caller.onLeave = e
    }
    onSync(e) {
        this.caller.onSync = e
    }
    inPendingSyncState() {
        return !this.joinRef || this.joinRef !== this.channel._joinRef()
    }
}
var y;
(function (n) {
    n.abstime = "abstime",
        n.bool = "bool",
        n.date = "date",
        n.daterange = "daterange",
        n.float4 = "float4",
        n.float8 = "float8",
        n.int2 = "int2",
        n.int4 = "int4",
        n.int4range = "int4range",
        n.int8 = "int8",
        n.int8range = "int8range",
        n.json = "json",
        n.jsonb = "jsonb",
        n.money = "money",
        n.numeric = "numeric",
        n.oid = "oid",
        n.reltime = "reltime",
        n.text = "text",
        n.time = "time",
        n.timestamp = "timestamp",
        n.timestamptz = "timestamptz",
        n.timetz = "timetz",
        n.tsrange = "tsrange",
        n.tstzrange = "tstzrange"
}
)(y || (y = {}));
const Ae = (n, e, t = {}) => {
    var s;
    const r = (s = t.skipTypes) !== null && s !== void 0 ? s : [];
    return Object.keys(e).reduce((i, o) => (i[o] = Et(o, n, e, r),
        i), {})
}
    , Et = (n, e, t, s) => {
        const r = e.find(a => a.name === n)
            , i = r?.type
            , o = t[n];
        return i && !s.includes(i) ? Ve(i, o) : ge(o)
    }
    , Ve = (n, e) => {
        if (n.charAt(0) === "_") {
            const t = n.slice(1, n.length);
            return $t(e, t)
        }
        switch (n) {
            case y.bool:
                return St(e);
            case y.float4:
            case y.float8:
            case y.int2:
            case y.int4:
            case y.int8:
            case y.numeric:
            case y.oid:
                return Tt(e);
            case y.json:
            case y.jsonb:
                return Ot(e);
            case y.timestamp:
                return jt(e);
            case y.abstime:
            case y.date:
            case y.daterange:
            case y.int4range:
            case y.int8range:
            case y.money:
            case y.reltime:
            case y.text:
            case y.time:
            case y.timestamptz:
            case y.timetz:
            case y.tsrange:
            case y.tstzrange:
                return ge(e);
            default:
                return ge(e)
        }
    }
    , ge = n => n
    , St = n => {
        switch (n) {
            case "t":
                return !0;
            case "f":
                return !1;
            default:
                return n
        }
    }
    , Tt = n => {
        if (typeof n == "string") {
            const e = parseFloat(n);
            if (!Number.isNaN(e))
                return e
        }
        return n
    }
    , Ot = n => {
        if (typeof n == "string")
            try {
                return JSON.parse(n)
            } catch (e) {
                return console.log(`JSON parse error: ${e}`),
                    n
            }
        return n
    }
    , $t = (n, e) => {
        if (typeof n != "string")
            return n;
        const t = n.length - 1
            , s = n[t];
        if (n[0] === "{" && s === "}") {
            let i;
            const o = n.slice(1, t);
            try {
                i = JSON.parse("[" + o + "]")
            } catch {
                i = o ? o.split(",") : []
            }
            return i.map(a => Ve(e, a))
        }
        return n
    }
    , jt = n => typeof n == "string" ? n.replace(" ", "T") : n;
var Pe;
(function (n) {
    n.ALL = "*",
        n.INSERT = "INSERT",
        n.UPDATE = "UPDATE",
        n.DELETE = "DELETE"
}
)(Pe || (Pe = {}));
var Ce;
(function (n) {
    n.BROADCAST = "broadcast",
        n.PRESENCE = "presence",
        n.POSTGRES_CHANGES = "postgres_changes"
}
)(Ce || (Ce = {}));
var Le;
(function (n) {
    n.SUBSCRIBED = "SUBSCRIBED",
        n.TIMED_OUT = "TIMED_OUT",
        n.CLOSED = "CLOSED",
        n.CHANNEL_ERROR = "CHANNEL_ERROR"
}
)(Le || (Le = {}));
class Se {
    constructor(e, t = {
        config: {}
    }, s) {
        this.topic = e,
            this.params = t,
            this.socket = s,
            this.bindings = {},
            this.state = E.closed,
            this.joinedOnce = !1,
            this.pushBuffer = [],
            this.subTopic = e.replace(/^realtime:/i, ""),
            this.params.config = Object.assign({
                broadcast: {
                    ack: !1,
                    self: !1
                },
                presence: {
                    key: ""
                }
            }, t.config),
            this.timeout = this.socket.timeout,
            this.joinPush = new ae(this, O.join, this.params, this.timeout),
            this.rejoinTimer = new Ke(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs),
            this.joinPush.receive("ok", () => {
                this.state = E.joined,
                    this.rejoinTimer.reset(),
                    this.pushBuffer.forEach(r => r.send()),
                    this.pushBuffer = []
            }
            ),
            this._onClose(() => {
                this.rejoinTimer.reset(),
                    this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`),
                    this.state = E.closed,
                    this.socket._remove(this)
            }
            ),
            this._onError(r => {
                this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, r),
                    this.state = E.errored,
                    this.rejoinTimer.scheduleTimeout())
            }
            ),
            this.joinPush.receive("timeout", () => {
                this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout),
                    this.state = E.errored,
                    this.rejoinTimer.scheduleTimeout())
            }
            ),
            this._on(O.reply, {}, (r, i) => {
                this._trigger(this._replyEventName(i), r)
            }
            ),
            this.presence = new Y(this),
            this.broadcastEndpointURL = this._broadcastEndpointURL()
    }
    subscribe(e, t = this.timeout) {
        var s, r;
        if (this.socket.isConnected() || this.socket.connect(),
            this.joinedOnce)
            throw "tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance";
        {
            const { config: { broadcast: i, presence: o } } = this.params;
            this._onError(l => e && e("CHANNEL_ERROR", l)),
                this._onClose(() => e && e("CLOSED"));
            const a = {}
                , c = {
                    broadcast: i,
                    presence: o,
                    postgres_changes: (r = (s = this.bindings.postgres_changes) === null || s === void 0 ? void 0 : s.map(l => l.filter)) !== null && r !== void 0 ? r : []
                };
            this.socket.accessToken && (a.access_token = this.socket.accessToken),
                this.updateJoinPayload(Object.assign({
                    config: c
                }, a)),
                this.joinedOnce = !0,
                this._rejoin(t),
                this.joinPush.receive("ok", ({ postgres_changes: l }) => {
                    var h;
                    if (this.socket.accessToken && this.socket.setAuth(this.socket.accessToken),
                        l === void 0) {
                        e && e("SUBSCRIBED");
                        return
                    } else {
                        const u = this.bindings.postgres_changes
                            , d = (h = u?.length) !== null && h !== void 0 ? h : 0
                            , f = [];
                        for (let v = 0; v < d; v++) {
                            const g = u[v]
                                , { filter: { event: _, schema: k, table: j, filter: $ } } = g
                                , w = l && l[v];
                            if (w && w.event === _ && w.schema === k && w.table === j && w.filter === $)
                                f.push(Object.assign(Object.assign({}, g), {
                                    id: w.id
                                }));
                            else {
                                this.unsubscribe(),
                                    e && e("CHANNEL_ERROR", new Error("mismatch between server and client bindings for postgres changes"));
                                return
                            }
                        }
                        this.bindings.postgres_changes = f,
                            e && e("SUBSCRIBED");
                        return
                    }
                }
                ).receive("error", l => {
                    e && e("CHANNEL_ERROR", new Error(JSON.stringify(Object.values(l).join(", ") || "error")))
                }
                ).receive("timeout", () => {
                    e && e("TIMED_OUT")
                }
                )
        }
        return this
    }
    presenceState() {
        return this.presence.state
    }
    async track(e, t = {}) {
        return await this.send({
            type: "presence",
            event: "track",
            payload: e
        }, t.timeout || this.timeout)
    }
    async untrack(e = {}) {
        return await this.send({
            type: "presence",
            event: "untrack"
        }, e)
    }
    on(e, t, s) {
        return this._on(e, t, s)
    }
    async send(e, t = {}) {
        var s, r;
        if (!this._canPush() && e.type === "broadcast") {
            const { event: i, payload: o } = e
                , a = {
                    method: "POST",
                    headers: {
                        apikey: (s = this.socket.apiKey) !== null && s !== void 0 ? s : "",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        messages: [{
                            topic: this.subTopic,
                            event: i,
                            payload: o
                        }]
                    })
                };
            try {
                return (await this._fetchWithTimeout(this.broadcastEndpointURL, a, (r = t.timeout) !== null && r !== void 0 ? r : this.timeout)).ok ? "ok" : "error"
            } catch (c) {
                return c.name === "AbortError" ? "timed out" : "error"
            }
        } else
            return new Promise(i => {
                var o, a, c;
                const l = this._push(e.type, e, t.timeout || this.timeout);
                e.type === "broadcast" && !(!((c = (a = (o = this.params) === null || o === void 0 ? void 0 : o.config) === null || a === void 0 ? void 0 : a.broadcast) === null || c === void 0) && c.ack) && i("ok"),
                    l.receive("ok", () => i("ok")),
                    l.receive("timeout", () => i("timed out"))
            }
            )
    }
    updateJoinPayload(e) {
        this.joinPush.updatePayload(e)
    }
    unsubscribe(e = this.timeout) {
        this.state = E.leaving;
        const t = () => {
            this.socket.log("channel", `leave ${this.topic}`),
                this._trigger(O.close, "leave", this._joinRef())
        }
            ;
        return this.rejoinTimer.reset(),
            this.joinPush.destroy(),
            new Promise(s => {
                const r = new ae(this, O.leave, {}, e);
                r.receive("ok", () => {
                    t(),
                        s("ok")
                }
                ).receive("timeout", () => {
                    t(),
                        s("timed out")
                }
                ).receive("error", () => {
                    s("error")
                }
                ),
                    r.send(),
                    this._canPush() || r.trigger("ok", {})
            }
            )
    }
    _broadcastEndpointURL() {
        let e = this.socket.endPoint;
        return e = e.replace(/^ws/i, "http"),
            e = e.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, ""),
            e.replace(/\/+$/, "") + "/api/broadcast"
    }
    async _fetchWithTimeout(e, t, s) {
        const r = new AbortController
            , i = setTimeout(() => r.abort(), s)
            , o = await this.socket.fetch(e, Object.assign(Object.assign({}, t), {
                signal: r.signal
            }));
        return clearTimeout(i),
            o
    }
    _push(e, t, s = this.timeout) {
        if (!this.joinedOnce)
            throw `tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
        let r = new ae(this, e, t, s);
        return this._canPush() ? r.send() : (r.startTimeout(),
            this.pushBuffer.push(r)),
            r
    }
    _onMessage(e, t, s) {
        return t
    }
    _isMember(e) {
        return this.topic === e
    }
    _joinRef() {
        return this.joinPush.ref
    }
    _trigger(e, t, s) {
        var r, i;
        const o = e.toLocaleLowerCase()
            , { close: a, error: c, leave: l, join: h } = O;
        if (s && [a, c, l, h].indexOf(o) >= 0 && s !== this._joinRef())
            return;
        let d = this._onMessage(o, t, s);
        if (t && !d)
            throw "channel onMessage callbacks must return the payload, modified or unmodified";
        ["insert", "update", "delete"].includes(o) ? (r = this.bindings.postgres_changes) === null || r === void 0 || r.filter(f => {
            var v, g, _;
            return ((v = f.filter) === null || v === void 0 ? void 0 : v.event) === "*" || ((_ = (g = f.filter) === null || g === void 0 ? void 0 : g.event) === null || _ === void 0 ? void 0 : _.toLocaleLowerCase()) === o
        }
        ).map(f => f.callback(d, s)) : (i = this.bindings[o]) === null || i === void 0 || i.filter(f => {
            var v, g, _, k, j, $;
            if (["broadcast", "presence", "postgres_changes"].includes(o))
                if ("id" in f) {
                    const w = f.id
                        , ee = (v = f.filter) === null || v === void 0 ? void 0 : v.event;
                    return w && ((g = t.ids) === null || g === void 0 ? void 0 : g.includes(w)) && (ee === "*" || ee?.toLocaleLowerCase() === ((_ = t.data) === null || _ === void 0 ? void 0 : _.type.toLocaleLowerCase()))
                } else {
                    const w = (j = (k = f?.filter) === null || k === void 0 ? void 0 : k.event) === null || j === void 0 ? void 0 : j.toLocaleLowerCase();
                    return w === "*" || w === (($ = t?.event) === null || $ === void 0 ? void 0 : $.toLocaleLowerCase())
                }
            else
                return f.type.toLocaleLowerCase() === o
        }
        ).map(f => {
            if (typeof d == "object" && "ids" in d) {
                const v = d.data
                    , { schema: g, table: _, commit_timestamp: k, type: j, errors: $ } = v;
                d = Object.assign(Object.assign({}, {
                    schema: g,
                    table: _,
                    commit_timestamp: k,
                    eventType: j,
                    new: {},
                    old: {},
                    errors: $
                }), this._getPayloadRecords(v))
            }
            f.callback(d, s)
        }
        )
    }
    _isClosed() {
        return this.state === E.closed
    }
    _isJoined() {
        return this.state === E.joined
    }
    _isJoining() {
        return this.state === E.joining
    }
    _isLeaving() {
        return this.state === E.leaving
    }
    _replyEventName(e) {
        return `chan_reply_${e}`
    }
    _on(e, t, s) {
        const r = e.toLocaleLowerCase()
            , i = {
                type: r,
                filter: t,
                callback: s
            };
        return this.bindings[r] ? this.bindings[r].push(i) : this.bindings[r] = [i],
            this
    }
    _off(e, t) {
        const s = e.toLocaleLowerCase();
        return this.bindings[s] = this.bindings[s].filter(r => {
            var i;
            return !(((i = r.type) === null || i === void 0 ? void 0 : i.toLocaleLowerCase()) === s && Se.isEqual(r.filter, t))
        }
        ),
            this
    }
    static isEqual(e, t) {
        if (Object.keys(e).length !== Object.keys(t).length)
            return !1;
        for (const s in e)
            if (e[s] !== t[s])
                return !1;
        return !0
    }
    _rejoinUntilConnected() {
        this.rejoinTimer.scheduleTimeout(),
            this.socket.isConnected() && this._rejoin()
    }
    _onClose(e) {
        this._on(O.close, {}, e)
    }
    _onError(e) {
        this._on(O.error, {}, t => e(t))
    }
    _canPush() {
        return this.socket.isConnected() && this._isJoined()
    }
    _rejoin(e = this.timeout) {
        this._isLeaving() || (this.socket._leaveOpenTopic(this.topic),
            this.state = E.joining,
            this.joinPush.resend(e))
    }
    _getPayloadRecords(e) {
        const t = {
            new: {},
            old: {}
        };
        return (e.type === "INSERT" || e.type === "UPDATE") && (t.new = Ae(e.columns, e.record)),
            (e.type === "UPDATE" || e.type === "DELETE") && (t.old = Ae(e.columns, e.old_record)),
            t
    }
}
const At = () => { }
    , Pt = typeof WebSocket < "u";
class Ct {
    constructor(e, t) {
        var s;
        this.accessToken = null,
            this.apiKey = null,
            this.channels = [],
            this.endPoint = "",
            this.headers = yt,
            this.params = {},
            this.timeout = He,
            this.heartbeatIntervalMs = 3e4,
            this.heartbeatTimer = void 0,
            this.pendingHeartbeatRef = null,
            this.ref = 0,
            this.logger = At,
            this.conn = null,
            this.sendBuffer = [],
            this.serializer = new kt,
            this.stateChangeCallbacks = {
                open: [],
                close: [],
                error: [],
                message: []
            },
            this._resolveFetch = i => {
                let o;
                return i ? o = i : typeof fetch > "u" ? o = (...a) => H(async () => {
                    const { default: c } = await Promise.resolve().then(() => Z);
                    return {
                        default: c
                    }
                }
                    , void 0).then(({ default: c }) => c(...a)) : o = fetch,
                    (...a) => o(...a)
            }
            ,
            this.endPoint = `${e}/${fe.websocket}`,
            t?.transport ? this.transport = t.transport : this.transport = null,
            t?.params && (this.params = t.params),
            t?.headers && (this.headers = Object.assign(Object.assign({}, this.headers), t.headers)),
            t?.timeout && (this.timeout = t.timeout),
            t?.logger && (this.logger = t.logger),
            t?.heartbeatIntervalMs && (this.heartbeatIntervalMs = t.heartbeatIntervalMs);
        const r = (s = t?.params) === null || s === void 0 ? void 0 : s.apikey;
        r && (this.accessToken = r,
            this.apiKey = r),
            this.reconnectAfterMs = t?.reconnectAfterMs ? t.reconnectAfterMs : i => [1e3, 2e3, 5e3, 1e4][i - 1] || 1e4,
            this.encode = t?.encode ? t.encode : (i, o) => o(JSON.stringify(i)),
            this.decode = t?.decode ? t.decode : this.serializer.decode.bind(this.serializer),
            this.reconnectTimer = new Ke(async () => {
                this.disconnect(),
                    this.connect()
            }
                , this.reconnectAfterMs),
            this.fetch = this._resolveFetch(t?.fetch)
    }
    connect() {
        if (!this.conn) {
            if (this.transport) {
                this.conn = new this.transport(this._endPointURL(), void 0, {
                    headers: this.headers
                });
                return
            }
            if (Pt) {
                this.conn = new WebSocket(this._endPointURL()),
                    this.setupConnection();
                return
            }
            this.conn = new Lt(this._endPointURL(), void 0, {
                close: () => {
                    this.conn = null
                }
            }),
                H(async () => {
                    const { default: e } = await import("./browser-BWSfbLXF.js").then(t => t.b);
                    return {
                        default: e
                    }
                }
                    , []).then(({ default: e }) => {
                        this.conn = new e(this._endPointURL(), void 0, {
                            headers: this.headers
                        }),
                            this.setupConnection()
                    }
                    )
        }
    }
    disconnect(e, t) {
        this.conn && (this.conn.onclose = function () { }
            ,
            e ? this.conn.close(e, t ?? "") : this.conn.close(),
            this.conn = null,
            this.heartbeatTimer && clearInterval(this.heartbeatTimer),
            this.reconnectTimer.reset())
    }
    getChannels() {
        return this.channels
    }
    async removeChannel(e) {
        const t = await e.unsubscribe();
        return this.channels.length === 0 && this.disconnect(),
            t
    }
    async removeAllChannels() {
        const e = await Promise.all(this.channels.map(t => t.unsubscribe()));
        return this.disconnect(),
            e
    }
    log(e, t, s) {
        this.logger(e, t, s)
    }
    connectionState() {
        switch (this.conn && this.conn.readyState) {
            case J.connecting:
                return I.Connecting;
            case J.open:
                return I.Open;
            case J.closing:
                return I.Closing;
            default:
                return I.Closed
        }
    }
    isConnected() {
        return this.connectionState() === I.Open
    }
    channel(e, t = {
        config: {}
    }) {
        const s = new Se(`realtime:${e}`, t, this);
        return this.channels.push(s),
            s
    }
    push(e) {
        const { topic: t, event: s, payload: r, ref: i } = e
            , o = () => {
                this.encode(e, a => {
                    var c;
                    (c = this.conn) === null || c === void 0 || c.send(a)
                }
                )
            }
            ;
        this.log("push", `${t} ${s} (${i})`, r),
            this.isConnected() ? o() : this.sendBuffer.push(o)
    }
    setAuth(e) {
        this.accessToken = e,
            this.channels.forEach(t => {
                e && t.updateJoinPayload({
                    access_token: e
                }),
                    t.joinedOnce && t._isJoined() && t._push(O.access_token, {
                        access_token: e
                    })
            }
            )
    }
    _makeRef() {
        let e = this.ref + 1;
        return e === this.ref ? this.ref = 0 : this.ref = e,
            this.ref.toString()
    }
    _leaveOpenTopic(e) {
        let t = this.channels.find(s => s.topic === e && (s._isJoined() || s._isJoining()));
        t && (this.log("transport", `leaving duplicate topic "${e}"`),
            t.unsubscribe())
    }
    _remove(e) {
        this.channels = this.channels.filter(t => t._joinRef() !== e._joinRef())
    }
    setupConnection() {
        this.conn && (this.conn.binaryType = "arraybuffer",
            this.conn.onopen = () => this._onConnOpen(),
            this.conn.onerror = e => this._onConnError(e),
            this.conn.onmessage = e => this._onConnMessage(e),
            this.conn.onclose = e => this._onConnClose(e))
    }
    _endPointURL() {
        return this._appendParams(this.endPoint, Object.assign({}, this.params, {
            vsn: wt
        }))
    }
    _onConnMessage(e) {
        this.decode(e.data, t => {
            let { topic: s, event: r, payload: i, ref: o } = t;
            (o && o === this.pendingHeartbeatRef || r === i?.type) && (this.pendingHeartbeatRef = null),
                this.log("receive", `${i.status || ""} ${s} ${r} ${o && "(" + o + ")" || ""}`, i),
                this.channels.filter(a => a._isMember(s)).forEach(a => a._trigger(r, i, o)),
                this.stateChangeCallbacks.message.forEach(a => a(t))
        }
        )
    }
    _onConnOpen() {
        this.log("transport", `connected to ${this._endPointURL()}`),
            this._flushSendBuffer(),
            this.reconnectTimer.reset(),
            this.heartbeatTimer && clearInterval(this.heartbeatTimer),
            this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs),
            this.stateChangeCallbacks.open.forEach(e => e())
    }
    _onConnClose(e) {
        this.log("transport", "close", e),
            this._triggerChanError(),
            this.heartbeatTimer && clearInterval(this.heartbeatTimer),
            this.reconnectTimer.scheduleTimeout(),
            this.stateChangeCallbacks.close.forEach(t => t(e))
    }
    _onConnError(e) {
        this.log("transport", e.message),
            this._triggerChanError(),
            this.stateChangeCallbacks.error.forEach(t => t(e))
    }
    _triggerChanError() {
        this.channels.forEach(e => e._trigger(O.error))
    }
    _appendParams(e, t) {
        if (Object.keys(t).length === 0)
            return e;
        const s = e.match(/\?/) ? "&" : "?"
            , r = new URLSearchParams(t);
        return `${e}${s}${r}`
    }
    _flushSendBuffer() {
        this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach(e => e()),
            this.sendBuffer = [])
    }
    _sendHeartbeat() {
        var e;
        if (this.isConnected()) {
            if (this.pendingHeartbeatRef) {
                this.pendingHeartbeatRef = null,
                    this.log("transport", "heartbeat timeout. Attempting to re-establish connection"),
                    (e = this.conn) === null || e === void 0 || e.close(bt, "hearbeat timeout");
                return
            }
            this.pendingHeartbeatRef = this._makeRef(),
                this.push({
                    topic: "phoenix",
                    event: "heartbeat",
                    payload: {},
                    ref: this.pendingHeartbeatRef
                }),
                this.setAuth(this.accessToken)
        }
    }
}
class Lt {
    constructor(e, t, s) {
        this.binaryType = "arraybuffer",
            this.onclose = () => { }
            ,
            this.onerror = () => { }
            ,
            this.onmessage = () => { }
            ,
            this.onopen = () => { }
            ,
            this.readyState = J.connecting,
            this.send = () => { }
            ,
            this.url = null,
            this.url = e,
            this.close = s.close
    }
}
class Te extends Error {
    constructor(e) {
        super(e),
            this.__isStorageError = !0,
            this.name = "StorageError"
    }
}
function b(n) {
    return typeof n == "object" && n !== null && "__isStorageError" in n
}
class Rt extends Te {
    constructor(e, t) {
        super(e),
            this.name = "StorageApiError",
            this.status = t
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status
        }
    }
}
class Re extends Te {
    constructor(e, t) {
        super(e),
            this.name = "StorageUnknownError",
            this.originalError = t
    }
}
var It = function (n, e, t, s) {
    function r(i) {
        return i instanceof t ? i : new t(function (o) {
            o(i)
        }
        )
    }
    return new (t || (t = Promise))(function (i, o) {
        function a(h) {
            try {
                l(s.next(h))
            } catch (u) {
                o(u)
            }
        }
        function c(h) {
            try {
                l(s.throw(h))
            } catch (u) {
                o(u)
            }
        }
        function l(h) {
            h.done ? i(h.value) : r(h.value).then(a, c)
        }
        l((s = s.apply(n, e || [])).next())
    }
    )
};
const Ge = n => {
    let e;
    return n ? e = n : typeof fetch > "u" ? e = (...t) => H(async () => {
        const { default: s } = await Promise.resolve().then(() => Z);
        return {
            default: s
        }
    }
        , void 0).then(({ default: s }) => s(...t)) : e = fetch,
        (...t) => e(...t)
}
    , xt = () => It(void 0, void 0, void 0, function* () {
        return typeof Response > "u" ? (yield H(() => Promise.resolve().then(() => Z), void 0)).Response : Response
    });
var V = function (n, e, t, s) {
    function r(i) {
        return i instanceof t ? i : new t(function (o) {
            o(i)
        }
        )
    }
    return new (t || (t = Promise))(function (i, o) {
        function a(h) {
            try {
                l(s.next(h))
            } catch (u) {
                o(u)
            }
        }
        function c(h) {
            try {
                l(s.throw(h))
            } catch (u) {
                o(u)
            }
        }
        function l(h) {
            h.done ? i(h.value) : r(h.value).then(a, c)
        }
        l((s = s.apply(n, e || [])).next())
    }
    )
};
const ce = n => n.msg || n.message || n.error_description || n.error || JSON.stringify(n)
    , Dt = (n, e) => V(void 0, void 0, void 0, function* () {
        const t = yield xt();
        n instanceof t ? n.json().then(s => {
            e(new Rt(ce(s), n.status || 500))
        }
        ).catch(s => {
            e(new Re(ce(s), s))
        }
        ) : e(new Re(ce(n), n))
    })
    , Ut = (n, e, t, s) => {
        const r = {
            method: n,
            headers: e?.headers || {}
        };
        return n === "GET" ? r : (r.headers = Object.assign({
            "Content-Type": "application/json"
        }, e?.headers),
            r.body = JSON.stringify(s),
            Object.assign(Object.assign({}, r), t))
    }
    ;
function ne(n, e, t, s, r, i) {
    return V(this, void 0, void 0, function* () {
        return new Promise((o, a) => {
            n(t, Ut(e, s, r, i)).then(c => {
                if (!c.ok)
                    throw c;
                return s?.noResolveJson ? c : c.json()
            }
            ).then(c => o(c)).catch(c => Dt(c, a))
        }
        )
    })
}
function pe(n, e, t, s) {
    return V(this, void 0, void 0, function* () {
        return ne(n, "GET", e, t, s)
    })
}
function A(n, e, t, s, r) {
    return V(this, void 0, void 0, function* () {
        return ne(n, "POST", e, s, r, t)
    })
}
function Nt(n, e, t, s, r) {
    return V(this, void 0, void 0, function* () {
        return ne(n, "PUT", e, s, r, t)
    })
}
function We(n, e, t, s, r) {
    return V(this, void 0, void 0, function* () {
        return ne(n, "DELETE", e, s, r, t)
    })
}
var S = function (n, e, t, s) {
    function r(i) {
        return i instanceof t ? i : new t(function (o) {
            o(i)
        }
        )
    }
    return new (t || (t = Promise))(function (i, o) {
        function a(h) {
            try {
                l(s.next(h))
            } catch (u) {
                o(u)
            }
        }
        function c(h) {
            try {
                l(s.throw(h))
            } catch (u) {
                o(u)
            }
        }
        function l(h) {
            h.done ? i(h.value) : r(h.value).then(a, c)
        }
        l((s = s.apply(n, e || [])).next())
    }
    )
};
const qt = {
    limit: 100,
    offset: 0,
    sortBy: {
        column: "name",
        order: "asc"
    }
}
    , Ie = {
        cacheControl: "3600",
        contentType: "text/plain;charset=UTF-8",
        upsert: !1
    };
class Ft {
    constructor(e, t = {}, s, r) {
        this.url = e,
            this.headers = t,
            this.bucketId = s,
            this.fetch = Ge(r)
    }
    uploadOrUpdate(e, t, s, r) {
        return S(this, void 0, void 0, function* () {
            try {
                let i;
                const o = Object.assign(Object.assign({}, Ie), r)
                    , a = Object.assign(Object.assign({}, this.headers), e === "POST" && {
                        "x-upsert": String(o.upsert)
                    });
                typeof Blob < "u" && s instanceof Blob ? (i = new FormData,
                    i.append("cacheControl", o.cacheControl),
                    i.append("", s)) : typeof FormData < "u" && s instanceof FormData ? (i = s,
                        i.append("cacheControl", o.cacheControl)) : (i = s,
                            a["cache-control"] = `max-age=${o.cacheControl}`,
                            a["content-type"] = o.contentType);
                const c = this._removeEmptyFolders(t)
                    , l = this._getFinalPath(c)
                    , h = yield this.fetch(`${this.url}/object/${l}`, Object.assign({
                        method: e,
                        body: i,
                        headers: a
                    }, o?.duplex ? {
                        duplex: o.duplex
                    } : {}))
                    , u = yield h.json();
                return h.ok ? {
                    data: {
                        path: c,
                        id: u.Id,
                        fullPath: u.Key
                    },
                    error: null
                } : {
                    data: null,
                    error: u
                }
            } catch (i) {
                if (b(i))
                    return {
                        data: null,
                        error: i
                    };
                throw i
            }
        })
    }
    upload(e, t, s) {
        return S(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("POST", e, t, s)
        })
    }
    uploadToSignedUrl(e, t, s, r) {
        return S(this, void 0, void 0, function* () {
            const i = this._removeEmptyFolders(e)
                , o = this._getFinalPath(i)
                , a = new URL(this.url + `/object/upload/sign/${o}`);
            a.searchParams.set("token", t);
            try {
                let c;
                const l = Object.assign({
                    upsert: Ie.upsert
                }, r)
                    , h = Object.assign(Object.assign({}, this.headers), {
                        "x-upsert": String(l.upsert)
                    });
                typeof Blob < "u" && s instanceof Blob ? (c = new FormData,
                    c.append("cacheControl", l.cacheControl),
                    c.append("", s)) : typeof FormData < "u" && s instanceof FormData ? (c = s,
                        c.append("cacheControl", l.cacheControl)) : (c = s,
                            h["cache-control"] = `max-age=${l.cacheControl}`,
                            h["content-type"] = l.contentType);
                const u = yield this.fetch(a.toString(), {
                    method: "PUT",
                    body: c,
                    headers: h
                })
                    , d = yield u.json();
                return u.ok ? {
                    data: {
                        path: i,
                        fullPath: d.Key
                    },
                    error: null
                } : {
                    data: null,
                    error: d
                }
            } catch (c) {
                if (b(c))
                    return {
                        data: null,
                        error: c
                    };
                throw c
            }
        })
    }
    createSignedUploadUrl(e) {
        return S(this, void 0, void 0, function* () {
            try {
                let t = this._getFinalPath(e);
                const s = yield A(this.fetch, `${this.url}/object/upload/sign/${t}`, {}, {
                    headers: this.headers
                })
                    , r = new URL(this.url + s.url)
                    , i = r.searchParams.get("token");
                if (!i)
                    throw new Te("No token returned by API");
                return {
                    data: {
                        signedUrl: r.toString(),
                        path: e,
                        token: i
                    },
                    error: null
                }
            } catch (t) {
                if (b(t))
                    return {
                        data: null,
                        error: t
                    };
                throw t
            }
        })
    }
    update(e, t, s) {
        return S(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("PUT", e, t, s)
        })
    }
    move(e, t) {
        return S(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield A(this.fetch, `${this.url}/object/move`, {
                        bucketId: this.bucketId,
                        sourceKey: e,
                        destinationKey: t
                    }, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (s) {
                if (b(s))
                    return {
                        data: null,
                        error: s
                    };
                throw s
            }
        })
    }
    copy(e, t) {
        return S(this, void 0, void 0, function* () {
            try {
                return {
                    data: {
                        path: (yield A(this.fetch, `${this.url}/object/copy`, {
                            bucketId: this.bucketId,
                            sourceKey: e,
                            destinationKey: t
                        }, {
                            headers: this.headers
                        })).Key
                    },
                    error: null
                }
            } catch (s) {
                if (b(s))
                    return {
                        data: null,
                        error: s
                    };
                throw s
            }
        })
    }
    createSignedUrl(e, t, s) {
        return S(this, void 0, void 0, function* () {
            try {
                let r = this._getFinalPath(e)
                    , i = yield A(this.fetch, `${this.url}/object/sign/${r}`, Object.assign({
                        expiresIn: t
                    }, s?.transform ? {
                        transform: s.transform
                    } : {}), {
                        headers: this.headers
                    });
                const o = s?.download ? `&download=${s.download === !0 ? "" : s.download}` : "";
                return i = {
                    signedUrl: encodeURI(`${this.url}${i.signedURL}${o}`)
                },
                {
                    data: i,
                    error: null
                }
            } catch (r) {
                if (b(r))
                    return {
                        data: null,
                        error: r
                    };
                throw r
            }
        })
    }
    createSignedUrls(e, t, s) {
        return S(this, void 0, void 0, function* () {
            try {
                const r = yield A(this.fetch, `${this.url}/object/sign/${this.bucketId}`, {
                    expiresIn: t,
                    paths: e
                }, {
                    headers: this.headers
                })
                    , i = s?.download ? `&download=${s.download === !0 ? "" : s.download}` : "";
                return {
                    data: r.map(o => Object.assign(Object.assign({}, o), {
                        signedUrl: o.signedURL ? encodeURI(`${this.url}${o.signedURL}${i}`) : null
                    })),
                    error: null
                }
            } catch (r) {
                if (b(r))
                    return {
                        data: null,
                        error: r
                    };
                throw r
            }
        })
    }
    download(e, t) {
        return S(this, void 0, void 0, function* () {
            const r = typeof t?.transform < "u" ? "render/image/authenticated" : "object"
                , i = this.transformOptsToQueryString(t?.transform || {})
                , o = i ? `?${i}` : "";
            try {
                const a = this._getFinalPath(e);
                return {
                    data: yield (yield pe(this.fetch, `${this.url}/${r}/${a}${o}`, {
                        headers: this.headers,
                        noResolveJson: !0
                    })).blob(),
                    error: null
                }
            } catch (a) {
                if (b(a))
                    return {
                        data: null,
                        error: a
                    };
                throw a
            }
        })
    }
    getPublicUrl(e, t) {
        const s = this._getFinalPath(e)
            , r = []
            , i = t?.download ? `download=${t.download === !0 ? "" : t.download}` : "";
        i !== "" && r.push(i);
        const a = typeof t?.transform < "u" ? "render/image" : "object"
            , c = this.transformOptsToQueryString(t?.transform || {});
        c !== "" && r.push(c);
        let l = r.join("&");
        return l !== "" && (l = `?${l}`),
        {
            data: {
                publicUrl: encodeURI(`${this.url}/${a}/public/${s}${l}`)
            }
        }
    }
    remove(e) {
        return S(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield We(this.fetch, `${this.url}/object/${this.bucketId}`, {
                        prefixes: e
                    }, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (t) {
                if (b(t))
                    return {
                        data: null,
                        error: t
                    };
                throw t
            }
        })
    }
    list(e, t, s) {
        return S(this, void 0, void 0, function* () {
            try {
                const r = Object.assign(Object.assign(Object.assign({}, qt), t), {
                    prefix: e || ""
                });
                return {
                    data: yield A(this.fetch, `${this.url}/object/list/${this.bucketId}`, r, {
                        headers: this.headers
                    }, s),
                    error: null
                }
            } catch (r) {
                if (b(r))
                    return {
                        data: null,
                        error: r
                    };
                throw r
            }
        })
    }
    _getFinalPath(e) {
        return `${this.bucketId}/${e}`
    }
    _removeEmptyFolders(e) {
        return e.replace(/^\/|\/$/g, "").replace(/\/+/g, "/")
    }
    transformOptsToQueryString(e) {
        const t = [];
        return e.width && t.push(`width=${e.width}`),
            e.height && t.push(`height=${e.height}`),
            e.resize && t.push(`resize=${e.resize}`),
            e.format && t.push(`format=${e.format}`),
            e.quality && t.push(`quality=${e.quality}`),
            t.join("&")
    }
}
const Bt = "2.5.5"
    , Mt = {
        "X-Client-Info": `storage-js/${Bt}`
    };
var U = function (n, e, t, s) {
    function r(i) {
        return i instanceof t ? i : new t(function (o) {
            o(i)
        }
        )
    }
    return new (t || (t = Promise))(function (i, o) {
        function a(h) {
            try {
                l(s.next(h))
            } catch (u) {
                o(u)
            }
        }
        function c(h) {
            try {
                l(s.throw(h))
            } catch (u) {
                o(u)
            }
        }
        function l(h) {
            h.done ? i(h.value) : r(h.value).then(a, c)
        }
        l((s = s.apply(n, e || [])).next())
    }
    )
};
class zt {
    constructor(e, t = {}, s) {
        this.url = e,
            this.headers = Object.assign(Object.assign({}, Mt), t),
            this.fetch = Ge(s)
    }
    listBuckets() {
        return U(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield pe(this.fetch, `${this.url}/bucket`, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (e) {
                if (b(e))
                    return {
                        data: null,
                        error: e
                    };
                throw e
            }
        })
    }
    getBucket(e) {
        return U(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield pe(this.fetch, `${this.url}/bucket/${e}`, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (t) {
                if (b(t))
                    return {
                        data: null,
                        error: t
                    };
                throw t
            }
        })
    }
    createBucket(e, t = {
        public: !1
    }) {
        return U(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield A(this.fetch, `${this.url}/bucket`, {
                        id: e,
                        name: e,
                        public: t.public,
                        file_size_limit: t.fileSizeLimit,
                        allowed_mime_types: t.allowedMimeTypes
                    }, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (s) {
                if (b(s))
                    return {
                        data: null,
                        error: s
                    };
                throw s
            }
        })
    }
    updateBucket(e, t) {
        return U(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield Nt(this.fetch, `${this.url}/bucket/${e}`, {
                        id: e,
                        name: e,
                        public: t.public,
                        file_size_limit: t.fileSizeLimit,
                        allowed_mime_types: t.allowedMimeTypes
                    }, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (s) {
                if (b(s))
                    return {
                        data: null,
                        error: s
                    };
                throw s
            }
        })
    }
    emptyBucket(e) {
        return U(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield A(this.fetch, `${this.url}/bucket/${e}/empty`, {}, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (t) {
                if (b(t))
                    return {
                        data: null,
                        error: t
                    };
                throw t
            }
        })
    }
    deleteBucket(e) {
        return U(this, void 0, void 0, function* () {
            try {
                return {
                    data: yield We(this.fetch, `${this.url}/bucket/${e}`, {}, {
                        headers: this.headers
                    }),
                    error: null
                }
            } catch (t) {
                if (b(t))
                    return {
                        data: null,
                        error: t
                    };
                throw t
            }
        })
    }
}
class Jt extends zt {
    constructor(e, t = {}, s) {
        super(e, t, s)
    }
    from(e) {
        return new Ft(this.url, this.headers, e, this.fetch)
    }
}
const Ht = "2.39.7";
let W = "";
typeof Deno < "u" ? W = "deno" : typeof document < "u" ? W = "web" : typeof navigator < "u" && navigator.product === "ReactNative" ? W = "react-native" : W = "node";
const Kt = {
    "X-Client-Info": `supabase-js-${W}/${Ht}`
}
    , Vt = {
        headers: Kt
    }
    , Gt = {
        schema: "public"
    }
    , Wt = {
        autoRefreshToken: !0,
        persistSession: !0,
        detectSessionInUrl: !0,
        flowType: "implicit"
    }
    , Yt = {};
var Xt = function (n, e, t, s) {
    function r(i) {
        return i instanceof t ? i : new t(function (o) {
            o(i)
        }
        )
    }
    return new (t || (t = Promise))(function (i, o) {
        function a(h) {
            try {
                l(s.next(h))
            } catch (u) {
                o(u)
            }
        }
        function c(h) {
            try {
                l(s.throw(h))
            } catch (u) {
                o(u)
            }
        }
        function l(h) {
            h.done ? i(h.value) : r(h.value).then(a, c)
        }
        l((s = s.apply(n, e || [])).next())
    }
    )
};
const Qt = n => {
    let e;
    return n ? e = n : typeof fetch > "u" ? e = ke : e = fetch,
        (...t) => e(...t)
}
    , Zt = () => typeof Headers > "u" ? Je : Headers
    , es = (n, e, t) => {
        const s = Qt(t)
            , r = Zt();
        return (i, o) => Xt(void 0, void 0, void 0, function* () {
            var a;
            const c = (a = yield e()) !== null && a !== void 0 ? a : n;
            let l = new r(o?.headers);
            return l.has("apikey") || l.set("apikey", n),
                l.has("Authorization") || l.set("Authorization", `Bearer ${c}`),
                s(i, Object.assign(Object.assign({}, o), {
                    headers: l
                }))
        })
    }
    ;
function ts(n) {
    return n.replace(/\/$/, "")
}
function ss(n, e) {
    const { db: t, auth: s, realtime: r, global: i } = n
        , { db: o, auth: a, realtime: c, global: l } = e;
    return {
        db: Object.assign(Object.assign({}, o), t),
        auth: Object.assign(Object.assign({}, a), s),
        realtime: Object.assign(Object.assign({}, c), r),
        global: Object.assign(Object.assign({}, l), i)
    }
}
function rs(n) {
    return Math.round(Date.now() / 1e3) + n
}
function is() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (n) {
        const e = Math.random() * 16 | 0;
        return (n == "x" ? e : e & 3 | 8).toString(16)
    })
}
const T = () => typeof document < "u"
    , C = {
        tested: !1,
        writable: !1
    }
    , X = () => {
        if (!T())
            return !1;
        try {
            if (typeof globalThis.localStorage != "object")
                return !1
        } catch {
            return !1
        }
        if (C.tested)
            return C.writable;
        const n = `lswt-${Math.random()}${Math.random()}`;
        try {
            globalThis.localStorage.setItem(n, n),
                globalThis.localStorage.removeItem(n),
                C.tested = !0,
                C.writable = !0
        } catch {
            C.tested = !0,
                C.writable = !1
        }
        return C.writable
    }
    ;
function le(n) {
    const e = {}
        , t = new URL(n);
    if (t.hash && t.hash[0] === "#")
        try {
            new URLSearchParams(t.hash.substring(1)).forEach((r, i) => {
                e[i] = r
            }
            )
        } catch { }
    return t.searchParams.forEach((s, r) => {
        e[r] = s
    }
    ),
        e
}
const Ye = n => {
    let e;
    return n ? e = n : typeof fetch > "u" ? e = (...t) => H(async () => {
        const { default: s } = await Promise.resolve().then(() => Z);
        return {
            default: s
        }
    }
        , void 0).then(({ default: s }) => s(...t)) : e = fetch,
        (...t) => e(...t)
}
    , ns = n => typeof n == "object" && n !== null && "status" in n && "ok" in n && "json" in n && typeof n.json == "function"
    , L = async (n, e, t) => {
        await n.setItem(e, JSON.stringify(t))
    }
    , te = async (n, e) => {
        const t = await n.getItem(e);
        if (!t)
            return null;
        try {
            return JSON.parse(t)
        } catch {
            return t
        }
    }
    , he = async (n, e) => {
        await n.removeItem(e)
    }
    ;
function os(n) {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let t = "", s, r, i, o, a, c, l, h = 0;
    for (n = n.replace("-", "+").replace("_", "/"); h < n.length;)
        o = e.indexOf(n.charAt(h++)),
            a = e.indexOf(n.charAt(h++)),
            c = e.indexOf(n.charAt(h++)),
            l = e.indexOf(n.charAt(h++)),
            s = o << 2 | a >> 4,
            r = (a & 15) << 4 | c >> 2,
            i = (c & 3) << 6 | l,
            t = t + String.fromCharCode(s),
            c != 64 && r != 0 && (t = t + String.fromCharCode(r)),
            l != 64 && i != 0 && (t = t + String.fromCharCode(i));
    return t
}
class oe {
    constructor() {
        this.promise = new oe.promiseConstructor((e, t) => {
            this.resolve = e,
                this.reject = t
        }
        )
    }
}
oe.promiseConstructor = Promise;
function xe(n) {
    const e = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i
        , t = n.split(".");
    if (t.length !== 3)
        throw new Error("JWT is not valid: not a JWT structure");
    if (!e.test(t[1]))
        throw new Error("JWT is not valid: payload is not in base64url format");
    const s = t[1];
    return JSON.parse(os(s))
}
async function as(n) {
    return await new Promise(e => {
        setTimeout(() => e(null), n)
    }
    )
}
function cs(n, e) {
    return new Promise((s, r) => {
        (async () => {
            for (let i = 0; i < 1 / 0; i++)
                try {
                    const o = await n(i);
                    if (!e(i, null, o)) {
                        s(o);
                        return
                    }
                } catch (o) {
                    if (!e(i, o)) {
                        r(o);
                        return
                    }
                }
        }
        )()
    }
    )
}
function ls(n) {
    return ("0" + n.toString(16)).substr(-2)
}
function N() {
    const e = new Uint32Array(56);
    if (typeof crypto > "u") {
        const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
            , s = t.length;
        let r = "";
        for (let i = 0; i < 56; i++)
            r += t.charAt(Math.floor(Math.random() * s));
        return r
    }
    return crypto.getRandomValues(e),
        Array.from(e, ls).join("")
}
async function hs(n) {
    const t = new TextEncoder().encode(n)
        , s = await crypto.subtle.digest("SHA-256", t)
        , r = new Uint8Array(s);
    return Array.from(r).map(i => String.fromCharCode(i)).join("")
}
function us(n) {
    return btoa(n).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}
async function q(n) {
    if (!(typeof crypto < "u" && typeof crypto.subtle < "u" && typeof TextEncoder < "u"))
        return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),
            n;
    const t = await hs(n);
    return us(t)
}
class Oe extends Error {
    constructor(e, t) {
        super(e),
            this.__isAuthError = !0,
            this.name = "AuthError",
            this.status = t
    }
}
function p(n) {
    return typeof n == "object" && n !== null && "__isAuthError" in n
}
class ds extends Oe {
    constructor(e, t) {
        super(e, t),
            this.name = "AuthApiError",
            this.status = t
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status
        }
    }
}
function fs(n) {
    return p(n) && n.name === "AuthApiError"
}
class Xe extends Oe {
    constructor(e, t) {
        super(e),
            this.name = "AuthUnknownError",
            this.originalError = t
    }
}
class D extends Oe {
    constructor(e, t, s) {
        super(e),
            this.name = t,
            this.status = s
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status
        }
    }
}
class F extends D {
    constructor() {
        super("Auth session missing!", "AuthSessionMissingError", 400)
    }
}
class ue extends D {
    constructor() {
        super("Auth session or user missing", "AuthInvalidTokenResponseError", 500)
    }
}
class se extends D {
    constructor(e) {
        super(e, "AuthInvalidCredentialsError", 400)
    }
}
class re extends D {
    constructor(e, t = null) {
        super(e, "AuthImplicitGrantRedirectError", 500),
            this.details = null,
            this.details = t
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            details: this.details
        }
    }
}
class De extends D {
    constructor(e, t = null) {
        super(e, "AuthPKCEGrantCodeExchangeError", 500),
            this.details = null,
            this.details = t
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            details: this.details
        }
    }
}
class me extends D {
    constructor(e, t) {
        super(e, "AuthRetryableFetchError", t)
    }
}
function de(n) {
    return p(n) && n.name === "AuthRetryableFetchError"
}
class gs extends D {
    constructor(e, t, s) {
        super(e, "AuthWeakPasswordError", t),
            this.reasons = s
    }
}
var ps = function (n, e) {
    var t = {};
    for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && e.indexOf(s) < 0 && (t[s] = n[s]);
    if (n != null && typeof Object.getOwnPropertySymbols == "function")
        for (var r = 0, s = Object.getOwnPropertySymbols(n); r < s.length; r++)
            e.indexOf(s[r]) < 0 && Object.prototype.propertyIsEnumerable.call(n, s[r]) && (t[s[r]] = n[s[r]]);
    return t
};
const z = n => n.msg || n.message || n.error_description || n.error || JSON.stringify(n)
    , ms = [502, 503, 504];
async function Ue(n) {
    if (!ns(n))
        throw new me(z(n), 0);
    if (ms.includes(n.status))
        throw new me(z(n), n.status);
    let e;
    try {
        e = await n.json()
    } catch (t) {
        throw new Xe(z(t), t)
    }
    throw typeof e == "object" && e && typeof e.weak_password == "object" && e.weak_password && Array.isArray(e.weak_password.reasons) && e.weak_password.reasons.length && e.weak_password.reasons.reduce((t, s) => t && typeof s == "string", !0) ? new gs(z(e), n.status, e.weak_password.reasons) : new ds(z(e), n.status || 500)
}
const vs = (n, e, t, s) => {
    const r = {
        method: n,
        headers: e?.headers || {}
    };
    return n === "GET" ? r : (r.headers = Object.assign({
        "Content-Type": "application/json;charset=UTF-8"
    }, e?.headers),
        r.body = JSON.stringify(s),
        Object.assign(Object.assign({}, r), t))
}
    ;
async function m(n, e, t, s) {
    var r;
    const i = Object.assign({}, s?.headers);
    s?.jwt && (i.Authorization = `Bearer ${s.jwt}`);
    const o = (r = s?.query) !== null && r !== void 0 ? r : {};
    s?.redirectTo && (o.redirect_to = s.redirectTo);
    const a = Object.keys(o).length ? "?" + new URLSearchParams(o).toString() : ""
        , c = await _s(n, e, t + a, {
            headers: i,
            noResolveJson: s?.noResolveJson
        }, {}, s?.body);
    return s?.xform ? s?.xform(c) : {
        data: Object.assign({}, c),
        error: null
    }
}
async function _s(n, e, t, s, r, i) {
    const o = vs(e, s, r, i);
    let a;
    try {
        a = await n(t, o)
    } catch (c) {
        throw console.error(c),
        new me(z(c), 0)
    }
    if (a.ok || await Ue(a),
        s?.noResolveJson)
        return a;
    try {
        return await a.json()
    } catch (c) {
        await Ue(c)
    }
}
function R(n) {
    var e;
    let t = null;
    ks(n) && (t = Object.assign({}, n),
        n.expires_at || (t.expires_at = rs(n.expires_in)));
    const s = (e = n.user) !== null && e !== void 0 ? e : n;
    return {
        data: {
            session: t,
            user: s
        },
        error: null
    }
}
function Ne(n) {
    const e = R(n);
    return !e.error && n.weak_password && typeof n.weak_password == "object" && Array.isArray(n.weak_password.reasons) && n.weak_password.reasons.length && n.weak_password.message && typeof n.weak_password.message == "string" && n.weak_password.reasons.reduce((t, s) => t && typeof s == "string", !0) && (e.data.weak_password = n.weak_password),
        e
}
function P(n) {
    var e;
    return {
        data: {
            user: (e = n.user) !== null && e !== void 0 ? e : n
        },
        error: null
    }
}
function ys(n) {
    return {
        data: n,
        error: null
    }
}
function ws(n) {
    const { action_link: e, email_otp: t, hashed_token: s, redirect_to: r, verification_type: i } = n
        , o = ps(n, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"])
        , a = {
            action_link: e,
            email_otp: t,
            hashed_token: s,
            redirect_to: r,
            verification_type: i
        }
        , c = Object.assign({}, o);
    return {
        data: {
            properties: a,
            user: c
        },
        error: null
    }
}
function bs(n) {
    return n
}
function ks(n) {
    return n.access_token && n.refresh_token && n.expires_in
}
var Es = function (n, e) {
    var t = {};
    for (var s in n)
        Object.prototype.hasOwnProperty.call(n, s) && e.indexOf(s) < 0 && (t[s] = n[s]);
    if (n != null && typeof Object.getOwnPropertySymbols == "function")
        for (var r = 0, s = Object.getOwnPropertySymbols(n); r < s.length; r++)
            e.indexOf(s[r]) < 0 && Object.prototype.propertyIsEnumerable.call(n, s[r]) && (t[s[r]] = n[s[r]]);
    return t
};
class Ss {
    constructor({ url: e = "", headers: t = {}, fetch: s }) {
        this.url = e,
            this.headers = t,
            this.fetch = Ye(s),
            this.mfa = {
                listFactors: this._listFactors.bind(this),
                deleteFactor: this._deleteFactor.bind(this)
            }
    }
    async signOut(e, t = "global") {
        try {
            return await m(this.fetch, "POST", `${this.url}/logout?scope=${t}`, {
                headers: this.headers,
                jwt: e,
                noResolveJson: !0
            }),
            {
                data: null,
                error: null
            }
        } catch (s) {
            if (p(s))
                return {
                    data: null,
                    error: s
                };
            throw s
        }
    }
    async inviteUserByEmail(e, t = {}) {
        try {
            return await m(this.fetch, "POST", `${this.url}/invite`, {
                body: {
                    email: e,
                    data: t.data
                },
                headers: this.headers,
                redirectTo: t.redirectTo,
                xform: P
            })
        } catch (s) {
            if (p(s))
                return {
                    data: {
                        user: null
                    },
                    error: s
                };
            throw s
        }
    }
    async generateLink(e) {
        try {
            const { options: t } = e
                , s = Es(e, ["options"])
                , r = Object.assign(Object.assign({}, s), t);
            return "newEmail" in s && (r.new_email = s?.newEmail,
                delete r.newEmail),
                await m(this.fetch, "POST", `${this.url}/admin/generate_link`, {
                    body: r,
                    headers: this.headers,
                    xform: ws,
                    redirectTo: t?.redirectTo
                })
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        properties: null,
                        user: null
                    },
                    error: t
                };
            throw t
        }
    }
    async createUser(e) {
        try {
            return await m(this.fetch, "POST", `${this.url}/admin/users`, {
                body: e,
                headers: this.headers,
                xform: P
            })
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        user: null
                    },
                    error: t
                };
            throw t
        }
    }
    async listUsers(e) {
        var t, s, r, i, o, a, c;
        try {
            const l = {
                nextPage: null,
                lastPage: 0,
                total: 0
            }
                , h = await m(this.fetch, "GET", `${this.url}/admin/users`, {
                    headers: this.headers,
                    noResolveJson: !0,
                    query: {
                        page: (s = (t = e?.page) === null || t === void 0 ? void 0 : t.toString()) !== null && s !== void 0 ? s : "",
                        per_page: (i = (r = e?.perPage) === null || r === void 0 ? void 0 : r.toString()) !== null && i !== void 0 ? i : ""
                    },
                    xform: bs
                });
            if (h.error)
                throw h.error;
            const u = await h.json()
                , d = (o = h.headers.get("x-total-count")) !== null && o !== void 0 ? o : 0
                , f = (c = (a = h.headers.get("link")) === null || a === void 0 ? void 0 : a.split(",")) !== null && c !== void 0 ? c : [];
            return f.length > 0 && (f.forEach(v => {
                const g = parseInt(v.split(";")[0].split("=")[1].substring(0, 1))
                    , _ = JSON.parse(v.split(";")[1].split("=")[1]);
                l[`${_}Page`] = g
            }
            ),
                l.total = parseInt(d)),
            {
                data: Object.assign(Object.assign({}, u), l),
                error: null
            }
        } catch (l) {
            if (p(l))
                return {
                    data: {
                        users: []
                    },
                    error: l
                };
            throw l
        }
    }
    async getUserById(e) {
        try {
            return await m(this.fetch, "GET", `${this.url}/admin/users/${e}`, {
                headers: this.headers,
                xform: P
            })
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        user: null
                    },
                    error: t
                };
            throw t
        }
    }
    async updateUserById(e, t) {
        try {
            return await m(this.fetch, "PUT", `${this.url}/admin/users/${e}`, {
                body: t,
                headers: this.headers,
                xform: P
            })
        } catch (s) {
            if (p(s))
                return {
                    data: {
                        user: null
                    },
                    error: s
                };
            throw s
        }
    }
    async deleteUser(e, t = !1) {
        try {
            return await m(this.fetch, "DELETE", `${this.url}/admin/users/${e}`, {
                headers: this.headers,
                body: {
                    should_soft_delete: t
                },
                xform: P
            })
        } catch (s) {
            if (p(s))
                return {
                    data: {
                        user: null
                    },
                    error: s
                };
            throw s
        }
    }
    async _listFactors(e) {
        try {
            const { data: t, error: s } = await m(this.fetch, "GET", `${this.url}/admin/users/${e.userId}/factors`, {
                headers: this.headers,
                xform: r => ({
                    data: {
                        factors: r
                    },
                    error: null
                })
            });
            return {
                data: t,
                error: s
            }
        } catch (t) {
            if (p(t))
                return {
                    data: null,
                    error: t
                };
            throw t
        }
    }
    async _deleteFactor(e) {
        try {
            return {
                data: await m(this.fetch, "DELETE", `${this.url}/admin/users/${e.userId}/factors/${e.id}`, {
                    headers: this.headers
                }),
                error: null
            }
        } catch (t) {
            if (p(t))
                return {
                    data: null,
                    error: t
                };
            throw t
        }
    }
}
const Qe = "0.0.0"
    , Ts = "http://localhost:9999"
    , Os = "supabase.auth.token"
    , $s = {
        "X-Client-Info": `gotrue-js/${Qe}`
    }
    , qe = 10
    , js = {
        getItem: n => X() ? globalThis.localStorage.getItem(n) : null,
        setItem: (n, e) => {
            X() && globalThis.localStorage.setItem(n, e)
        }
        ,
        removeItem: n => {
            X() && globalThis.localStorage.removeItem(n)
        }
    };
function Fe(n = {}) {
    return {
        getItem: e => n[e] || null,
        setItem: (e, t) => {
            n[e] = t
        }
        ,
        removeItem: e => {
            delete n[e]
        }
    }
}
function As() {
    if (typeof globalThis != "object")
        try {
            Object.defineProperty(Object.prototype, "__magic__", {
                get: function () {
                    return this
                },
                configurable: !0
            }),
                __magic__.globalThis = __magic__,
                delete Object.prototype.__magic__
        } catch {
            typeof self < "u" && (self.globalThis = self)
        }
}
const B = {
    debug: !!(globalThis && X() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
};
class Ze extends Error {
    constructor(e) {
        super(e),
            this.isAcquireTimeout = !0
    }
}
class Ps extends Ze {
}
async function Cs(n, e, t) {
    B.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", n, e);
    const s = new globalThis.AbortController;
    return e > 0 && setTimeout(() => {
        s.abort(),
            B.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", n)
    }
        , e),
        await globalThis.navigator.locks.request(n, e === 0 ? {
            mode: "exclusive",
            ifAvailable: !0
        } : {
            mode: "exclusive",
            signal: s.signal
        }, async r => {
            if (r) {
                B.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", n, r.name);
                try {
                    return await t()
                } finally {
                    B.debug && console.log("@supabase/gotrue-js: navigatorLock: released", n, r.name)
                }
            } else {
                if (e === 0)
                    throw B.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", n),
                    new Ps(`Acquiring an exclusive Navigator LockManager lock "${n}" immediately failed`);
                if (B.debug)
                    try {
                        const i = await globalThis.navigator.locks.query();
                        console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(i, null, "  "))
                    } catch (i) {
                        console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", i)
                    }
                return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"),
                    await t()
            }
        }
        )
}
As();
const Ls = {
    url: Ts,
    storageKey: Os,
    autoRefreshToken: !0,
    persistSession: !0,
    detectSessionInUrl: !0,
    headers: $s,
    flowType: "implicit",
    debug: !1
}
    , G = 30 * 1e3
    , Be = 3;
async function Me(n, e, t) {
    return await t()
}
class Q {
    constructor(e) {
        var t, s;
        this.memoryStorage = null,
            this.stateChangeEmitters = new Map,
            this.autoRefreshTicker = null,
            this.visibilityChangedCallback = null,
            this.refreshingDeferred = null,
            this.initializePromise = null,
            this.detectSessionInUrl = !0,
            this.lockAcquired = !1,
            this.pendingInLock = [],
            this.broadcastChannel = null,
            this.logger = console.log,
            this.instanceID = Q.nextInstanceID,
            Q.nextInstanceID += 1,
            this.instanceID > 0 && T() && console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
        const r = Object.assign(Object.assign({}, Ls), e);
        if (this.logDebugMessages = !!r.debug,
            typeof r.debug == "function" && (this.logger = r.debug),
            this.persistSession = r.persistSession,
            this.storageKey = r.storageKey,
            this.autoRefreshToken = r.autoRefreshToken,
            this.admin = new Ss({
                url: r.url,
                headers: r.headers,
                fetch: r.fetch
            }),
            this.url = r.url,
            this.headers = r.headers,
            this.fetch = Ye(r.fetch),
            this.lock = r.lock || Me,
            this.detectSessionInUrl = r.detectSessionInUrl,
            this.flowType = r.flowType,
            r.lock ? this.lock = r.lock : T() && (!((t = globalThis?.navigator) === null || t === void 0) && t.locks) ? this.lock = Cs : this.lock = Me,
            this.mfa = {
                verify: this._verify.bind(this),
                enroll: this._enroll.bind(this),
                unenroll: this._unenroll.bind(this),
                challenge: this._challenge.bind(this),
                listFactors: this._listFactors.bind(this),
                challengeAndVerify: this._challengeAndVerify.bind(this),
                getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
            },
            this.persistSession ? r.storage ? this.storage = r.storage : X() ? this.storage = js : (this.memoryStorage = {},
                this.storage = Fe(this.memoryStorage)) : (this.memoryStorage = {},
                    this.storage = Fe(this.memoryStorage)),
            T() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
            try {
                this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey)
            } catch (i) {
                console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", i)
            }
            (s = this.broadcastChannel) === null || s === void 0 || s.addEventListener("message", async i => {
                this._debug("received broadcast notification from other tab or client", i),
                    await this._notifyAllSubscribers(i.data.event, i.data.session, !1)
            }
            )
        }
        this.initialize()
    }
    _debug(...e) {
        return this.logDebugMessages && this.logger(`GoTrueClient@${this.instanceID} (${Qe}) ${new Date().toISOString()}`, ...e),
            this
    }
    async initialize() {
        return this.initializePromise ? await this.initializePromise : (this.initializePromise = (async () => await this._acquireLock(-1, async () => await this._initialize()))(),
            await this.initializePromise)
    }
    async _initialize() {
        try {
            const e = T() ? await this._isPKCEFlow() : !1;
            if (this._debug("#_initialize()", "begin", "is PKCE flow", e),
                e || this.detectSessionInUrl && this._isImplicitGrantFlow()) {
                const { data: t, error: s } = await this._getSessionFromURL(e);
                if (s)
                    return this._debug("#_initialize()", "error detecting session from URL", s),
                        s?.message === "Identity is already linked" || s?.message === "Identity is already linked to another user" ? {
                            error: s
                        } : (await this._removeSession(),
                        {
                            error: s
                        });
                const { session: r, redirectType: i } = t;
                return this._debug("#_initialize()", "detected session in URL", r, "redirect type", i),
                    await this._saveSession(r),
                    setTimeout(async () => {
                        i === "recovery" ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", r) : await this._notifyAllSubscribers("SIGNED_IN", r)
                    }
                        , 0),
                {
                    error: null
                }
            }
            return await this._recoverAndRefresh(),
            {
                error: null
            }
        } catch (e) {
            return p(e) ? {
                error: e
            } : {
                error: new Xe("Unexpected error during initialization", e)
            }
        } finally {
            await this._handleVisibilityChange(),
                this._debug("#_initialize()", "end")
        }
    }
    async signUp(e) {
        var t, s, r;
        try {
            await this._removeSession();
            let i;
            if ("email" in e) {
                const { email: h, password: u, options: d } = e;
                let f = null
                    , v = null;
                if (this.flowType === "pkce") {
                    const g = N();
                    await L(this.storage, `${this.storageKey}-code-verifier`, g),
                        f = await q(g),
                        v = g === f ? "plain" : "s256"
                }
                i = await m(this.fetch, "POST", `${this.url}/signup`, {
                    headers: this.headers,
                    redirectTo: d?.emailRedirectTo,
                    body: {
                        email: h,
                        password: u,
                        data: (t = d?.data) !== null && t !== void 0 ? t : {},
                        gotrue_meta_security: {
                            captcha_token: d?.captchaToken
                        },
                        code_challenge: f,
                        code_challenge_method: v
                    },
                    xform: R
                })
            } else if ("phone" in e) {
                const { phone: h, password: u, options: d } = e;
                i = await m(this.fetch, "POST", `${this.url}/signup`, {
                    headers: this.headers,
                    body: {
                        phone: h,
                        password: u,
                        data: (s = d?.data) !== null && s !== void 0 ? s : {},
                        channel: (r = d?.channel) !== null && r !== void 0 ? r : "sms",
                        gotrue_meta_security: {
                            captcha_token: d?.captchaToken
                        }
                    },
                    xform: R
                })
            } else
                throw new se("You must provide either an email or phone number and a password");
            const { data: o, error: a } = i;
            if (a || !o)
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: a
                };
            const c = o.session
                , l = o.user;
            return o.session && (await this._saveSession(o.session),
                await this._notifyAllSubscribers("SIGNED_IN", c)),
            {
                data: {
                    user: l,
                    session: c
                },
                error: null
            }
        } catch (i) {
            if (p(i))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: i
                };
            throw i
        }
    }
    async signInWithPassword(e) {
        try {
            await this._removeSession();
            let t;
            if ("email" in e) {
                const { email: i, password: o, options: a } = e;
                t = await m(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
                    headers: this.headers,
                    body: {
                        email: i,
                        password: o,
                        gotrue_meta_security: {
                            captcha_token: a?.captchaToken
                        }
                    },
                    xform: Ne
                })
            } else if ("phone" in e) {
                const { phone: i, password: o, options: a } = e;
                t = await m(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
                    headers: this.headers,
                    body: {
                        phone: i,
                        password: o,
                        gotrue_meta_security: {
                            captcha_token: a?.captchaToken
                        }
                    },
                    xform: Ne
                })
            } else
                throw new se("You must provide either an email or phone number and a password");
            const { data: s, error: r } = t;
            return r ? {
                data: {
                    user: null,
                    session: null
                },
                error: r
            } : !s || !s.session || !s.user ? {
                data: {
                    user: null,
                    session: null
                },
                error: new ue
            } : (s.session && (await this._saveSession(s.session),
                await this._notifyAllSubscribers("SIGNED_IN", s.session)),
            {
                data: Object.assign({
                    user: s.user,
                    session: s.session
                }, s.weak_password ? {
                    weakPassword: s.weak_password
                } : null),
                error: r
            })
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: t
                };
            throw t
        }
    }
    async signInWithOAuth(e) {
        var t, s, r, i;
        return await this._removeSession(),
            await this._handleProviderSignIn(e.provider, {
                redirectTo: (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo,
                scopes: (s = e.options) === null || s === void 0 ? void 0 : s.scopes,
                queryParams: (r = e.options) === null || r === void 0 ? void 0 : r.queryParams,
                skipBrowserRedirect: (i = e.options) === null || i === void 0 ? void 0 : i.skipBrowserRedirect
            })
    }
    async exchangeCodeForSession(e) {
        return await this.initializePromise,
            this._acquireLock(-1, async () => this._exchangeCodeForSession(e))
    }
    async _exchangeCodeForSession(e) {
        const t = await te(this.storage, `${this.storageKey}-code-verifier`)
            , [s, r] = (t ?? "").split("/")
            , { data: i, error: o } = await m(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
                headers: this.headers,
                body: {
                    auth_code: e,
                    code_verifier: s
                },
                xform: R
            });
        return await he(this.storage, `${this.storageKey}-code-verifier`),
            o ? {
                data: {
                    user: null,
                    session: null,
                    redirectType: null
                },
                error: o
            } : !i || !i.session || !i.user ? {
                data: {
                    user: null,
                    session: null,
                    redirectType: null
                },
                error: new ue
            } : (i.session && (await this._saveSession(i.session),
                await this._notifyAllSubscribers("SIGNED_IN", i.session)),
            {
                data: Object.assign(Object.assign({}, i), {
                    redirectType: r ?? null
                }),
                error: o
            })
    }
    async signInWithIdToken(e) {
        await this._removeSession();
        try {
            const { options: t, provider: s, token: r, access_token: i, nonce: o } = e
                , a = await m(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
                    headers: this.headers,
                    body: {
                        provider: s,
                        id_token: r,
                        access_token: i,
                        nonce: o,
                        gotrue_meta_security: {
                            captcha_token: t?.captchaToken
                        }
                    },
                    xform: R
                })
                , { data: c, error: l } = a;
            return l ? {
                data: {
                    user: null,
                    session: null
                },
                error: l
            } : !c || !c.session || !c.user ? {
                data: {
                    user: null,
                    session: null
                },
                error: new ue
            } : (c.session && (await this._saveSession(c.session),
                await this._notifyAllSubscribers("SIGNED_IN", c.session)),
            {
                data: c,
                error: l
            })
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: t
                };
            throw t
        }
    }
    async signInWithOtp(e) {
        var t, s, r, i, o;
        try {
            if (await this._removeSession(),
                "email" in e) {
                const { email: a, options: c } = e;
                let l = null
                    , h = null;
                if (this.flowType === "pkce") {
                    const d = N();
                    await L(this.storage, `${this.storageKey}-code-verifier`, d),
                        l = await q(d),
                        h = d === l ? "plain" : "s256"
                }
                const { error: u } = await m(this.fetch, "POST", `${this.url}/otp`, {
                    headers: this.headers,
                    body: {
                        email: a,
                        data: (t = c?.data) !== null && t !== void 0 ? t : {},
                        create_user: (s = c?.shouldCreateUser) !== null && s !== void 0 ? s : !0,
                        gotrue_meta_security: {
                            captcha_token: c?.captchaToken
                        },
                        code_challenge: l,
                        code_challenge_method: h
                    },
                    redirectTo: c?.emailRedirectTo
                });
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: u
                }
            }
            if ("phone" in e) {
                const { phone: a, options: c } = e
                    , { data: l, error: h } = await m(this.fetch, "POST", `${this.url}/otp`, {
                        headers: this.headers,
                        body: {
                            phone: a,
                            data: (r = c?.data) !== null && r !== void 0 ? r : {},
                            create_user: (i = c?.shouldCreateUser) !== null && i !== void 0 ? i : !0,
                            gotrue_meta_security: {
                                captcha_token: c?.captchaToken
                            },
                            channel: (o = c?.channel) !== null && o !== void 0 ? o : "sms"
                        }
                    });
                return {
                    data: {
                        user: null,
                        session: null,
                        messageId: l?.message_id
                    },
                    error: h
                }
            }
            throw new se("You must provide either an email or phone number.")
        } catch (a) {
            if (p(a))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: a
                };
            throw a
        }
    }
    async verifyOtp(e) {
        var t, s;
        try {
            e.type !== "email_change" && e.type !== "phone_change" && await this._removeSession();
            let r, i;
            "options" in e && (r = (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo,
                i = (s = e.options) === null || s === void 0 ? void 0 : s.captchaToken);
            const { data: o, error: a } = await m(this.fetch, "POST", `${this.url}/verify`, {
                headers: this.headers,
                body: Object.assign(Object.assign({}, e), {
                    gotrue_meta_security: {
                        captcha_token: i
                    }
                }),
                redirectTo: r,
                xform: R
            });
            if (a)
                throw a;
            if (!o)
                throw new Error("An error occurred on token verification.");
            const c = o.session
                , l = o.user;
            return c?.access_token && (await this._saveSession(c),
                await this._notifyAllSubscribers(e.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", c)),
            {
                data: {
                    user: l,
                    session: c
                },
                error: null
            }
        } catch (r) {
            if (p(r))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: r
                };
            throw r
        }
    }
    async signInWithSSO(e) {
        var t, s, r;
        try {
            await this._removeSession();
            let i = null
                , o = null;
            if (this.flowType === "pkce") {
                const a = N();
                await L(this.storage, `${this.storageKey}-code-verifier`, a),
                    i = await q(a),
                    o = a === i ? "plain" : "s256"
            }
            return await m(this.fetch, "POST", `${this.url}/sso`, {
                body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in e ? {
                    provider_id: e.providerId
                } : null), "domain" in e ? {
                    domain: e.domain
                } : null), {
                    redirect_to: (s = (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo) !== null && s !== void 0 ? s : void 0
                }), !((r = e?.options) === null || r === void 0) && r.captchaToken ? {
                    gotrue_meta_security: {
                        captcha_token: e.options.captchaToken
                    }
                } : null), {
                    skip_http_redirect: !0,
                    code_challenge: i,
                    code_challenge_method: o
                }),
                headers: this.headers,
                xform: ys
            })
        } catch (i) {
            if (p(i))
                return {
                    data: null,
                    error: i
                };
            throw i
        }
    }
    async reauthenticate() {
        return await this.initializePromise,
            await this._acquireLock(-1, async () => await this._reauthenticate())
    }
    async _reauthenticate() {
        try {
            return await this._useSession(async e => {
                const { data: { session: t }, error: s } = e;
                if (s)
                    throw s;
                if (!t)
                    throw new F;
                const { error: r } = await m(this.fetch, "GET", `${this.url}/reauthenticate`, {
                    headers: this.headers,
                    jwt: t.access_token
                });
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: r
                }
            }
            )
        } catch (e) {
            if (p(e))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: e
                };
            throw e
        }
    }
    async resend(e) {
        try {
            e.type != "email_change" && e.type != "phone_change" && await this._removeSession();
            const t = `${this.url}/resend`;
            if ("email" in e) {
                const { email: s, type: r, options: i } = e
                    , { error: o } = await m(this.fetch, "POST", t, {
                        headers: this.headers,
                        body: {
                            email: s,
                            type: r,
                            gotrue_meta_security: {
                                captcha_token: i?.captchaToken
                            }
                        },
                        redirectTo: i?.emailRedirectTo
                    });
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: o
                }
            } else if ("phone" in e) {
                const { phone: s, type: r, options: i } = e
                    , { data: o, error: a } = await m(this.fetch, "POST", t, {
                        headers: this.headers,
                        body: {
                            phone: s,
                            type: r,
                            gotrue_meta_security: {
                                captcha_token: i?.captchaToken
                            }
                        }
                    });
                return {
                    data: {
                        user: null,
                        session: null,
                        messageId: o?.message_id
                    },
                    error: a
                }
            }
            throw new se("You must provide either an email or phone number and a type")
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: t
                };
            throw t
        }
    }
    async getSession() {
        return await this.initializePromise,
            this._acquireLock(-1, async () => this._useSession(async e => e))
    }
    async _acquireLock(e, t) {
        this._debug("#_acquireLock", "begin", e);
        try {
            if (this.lockAcquired) {
                const s = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve()
                    , r = (async () => (await s,
                        await t()))();
                return this.pendingInLock.push((async () => {
                    try {
                        await r
                    } catch { }
                }
                )()),
                    r
            }
            return await this.lock(`lock:${this.storageKey}`, e, async () => {
                this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
                try {
                    this.lockAcquired = !0;
                    const s = t();
                    for (this.pendingInLock.push((async () => {
                        try {
                            await s
                        } catch { }
                    }
                    )()),
                        await s; this.pendingInLock.length;) {
                        const r = [...this.pendingInLock];
                        await Promise.all(r),
                            this.pendingInLock.splice(0, r.length)
                    }
                    return await s
                } finally {
                    this._debug("#_acquireLock", "lock released for storage key", this.storageKey),
                        this.lockAcquired = !1
                }
            }
            )
        } finally {
            this._debug("#_acquireLock", "end")
        }
    }
    async _useSession(e) {
        this._debug("#_useSession", "begin");
        try {
            const t = await this.__loadSession();
            return await e(t)
        } finally {
            this._debug("#_useSession", "end")
        }
    }
    async __loadSession() {
        this._debug("#__loadSession()", "begin"),
            this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
        try {
            let e = null;
            const t = await te(this.storage, this.storageKey);
            if (this._debug("#getSession()", "session from storage", t),
                t !== null && (this._isValidSession(t) ? e = t : (this._debug("#getSession()", "session from storage is not valid"),
                    await this._removeSession())),
                !e)
                return {
                    data: {
                        session: null
                    },
                    error: null
                };
            const s = e.expires_at ? e.expires_at <= Date.now() / 1e3 : !1;
            if (this._debug("#__loadSession()", `session has${s ? "" : " not"} expired`, "expires_at", e.expires_at),
                !s)
                return {
                    data: {
                        session: e
                    },
                    error: null
                };
            const { session: r, error: i } = await this._callRefreshToken(e.refresh_token);
            return i ? {
                data: {
                    session: null
                },
                error: i
            } : {
                data: {
                    session: r
                },
                error: null
            }
        } finally {
            this._debug("#__loadSession()", "end")
        }
    }
    async getUser(e) {
        return e ? await this._getUser(e) : (await this.initializePromise,
            this._acquireLock(-1, async () => await this._getUser()))
    }
    async _getUser(e) {
        try {
            return e ? await m(this.fetch, "GET", `${this.url}/user`, {
                headers: this.headers,
                jwt: e,
                xform: P
            }) : await this._useSession(async t => {
                var s, r;
                const { data: i, error: o } = t;
                if (o)
                    throw o;
                return await m(this.fetch, "GET", `${this.url}/user`, {
                    headers: this.headers,
                    jwt: (r = (s = i.session) === null || s === void 0 ? void 0 : s.access_token) !== null && r !== void 0 ? r : void 0,
                    xform: P
                })
            }
            )
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        user: null
                    },
                    error: t
                };
            throw t
        }
    }
    async updateUser(e, t = {}) {
        return await this.initializePromise,
            await this._acquireLock(-1, async () => await this._updateUser(e, t))
    }
    async _updateUser(e, t = {}) {
        try {
            return await this._useSession(async s => {
                const { data: r, error: i } = s;
                if (i)
                    throw i;
                if (!r.session)
                    throw new F;
                const o = r.session;
                let a = null
                    , c = null;
                if (this.flowType === "pkce" && e.email != null) {
                    const u = N();
                    await L(this.storage, `${this.storageKey}-code-verifier`, u),
                        a = await q(u),
                        c = u === a ? "plain" : "s256"
                }
                const { data: l, error: h } = await m(this.fetch, "PUT", `${this.url}/user`, {
                    headers: this.headers,
                    redirectTo: t?.emailRedirectTo,
                    body: Object.assign(Object.assign({}, e), {
                        code_challenge: a,
                        code_challenge_method: c
                    }),
                    jwt: o.access_token,
                    xform: P
                });
                if (h)
                    throw h;
                return o.user = l.user,
                    await this._saveSession(o),
                    await this._notifyAllSubscribers("USER_UPDATED", o),
                {
                    data: {
                        user: o.user
                    },
                    error: null
                }
            }
            )
        } catch (s) {
            if (p(s))
                return {
                    data: {
                        user: null
                    },
                    error: s
                };
            throw s
        }
    }
    _decodeJWT(e) {
        return xe(e)
    }
    async setSession(e) {
        return await this.initializePromise,
            await this._acquireLock(-1, async () => await this._setSession(e))
    }
    async _setSession(e) {
        try {
            if (!e.access_token || !e.refresh_token)
                throw new F;
            const t = Date.now() / 1e3;
            let s = t
                , r = !0
                , i = null;
            const o = xe(e.access_token);
            if (o.exp && (s = o.exp,
                r = s <= t),
                r) {
                const { session: a, error: c } = await this._callRefreshToken(e.refresh_token);
                if (c)
                    return {
                        data: {
                            user: null,
                            session: null
                        },
                        error: c
                    };
                if (!a)
                    return {
                        data: {
                            user: null,
                            session: null
                        },
                        error: null
                    };
                i = a
            } else {
                const { data: a, error: c } = await this._getUser(e.access_token);
                if (c)
                    throw c;
                i = {
                    access_token: e.access_token,
                    refresh_token: e.refresh_token,
                    user: a.user,
                    token_type: "bearer",
                    expires_in: s - t,
                    expires_at: s
                },
                    await this._saveSession(i),
                    await this._notifyAllSubscribers("SIGNED_IN", i)
            }
            return {
                data: {
                    user: i.user,
                    session: i
                },
                error: null
            }
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        session: null,
                        user: null
                    },
                    error: t
                };
            throw t
        }
    }
    async refreshSession(e) {
        return await this.initializePromise,
            await this._acquireLock(-1, async () => await this._refreshSession(e))
    }
    async _refreshSession(e) {
        try {
            return await this._useSession(async t => {
                var s;
                if (!e) {
                    const { data: o, error: a } = t;
                    if (a)
                        throw a;
                    e = (s = o.session) !== null && s !== void 0 ? s : void 0
                }
                if (!e?.refresh_token)
                    throw new F;
                const { session: r, error: i } = await this._callRefreshToken(e.refresh_token);
                return i ? {
                    data: {
                        user: null,
                        session: null
                    },
                    error: i
                } : r ? {
                    data: {
                        user: r.user,
                        session: r
                    },
                    error: null
                } : {
                    data: {
                        user: null,
                        session: null
                    },
                    error: null
                }
            }
            )
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        user: null,
                        session: null
                    },
                    error: t
                };
            throw t
        }
    }
    async _getSessionFromURL(e) {
        try {
            if (!T())
                throw new re("No browser detected.");
            if (this.flowType === "implicit" && !this._isImplicitGrantFlow())
                throw new re("Not a valid implicit grant flow url.");
            if (this.flowType == "pkce" && !e)
                throw new De("Not a valid PKCE flow url.");
            const t = le(window.location.href);
            if (e) {
                if (!t.code)
                    throw new De("No code detected.");
                const { data: j, error: $ } = await this._exchangeCodeForSession(t.code);
                if ($)
                    throw $;
                const w = new URL(window.location.href);
                return w.searchParams.delete("code"),
                    window.history.replaceState(window.history.state, "", w.toString()),
                {
                    data: {
                        session: j.session,
                        redirectType: null
                    },
                    error: null
                }
            }
            if (t.error || t.error_description || t.error_code)
                throw new re(t.error_description || "Error in URL with unspecified error_description", {
                    error: t.error || "unspecified_error",
                    code: t.error_code || "unspecified_code"
                });
            const { provider_token: s, provider_refresh_token: r, access_token: i, refresh_token: o, expires_in: a, expires_at: c, token_type: l } = t;
            if (!i || !a || !o || !l)
                throw new re("No session defined in URL");
            const h = Math.round(Date.now() / 1e3)
                , u = parseInt(a);
            let d = h + u;
            c && (d = parseInt(c));
            const f = d - h;
            f * 1e3 <= G && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${u}s`);
            const v = d - u;
            h - v >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", v, d, h) : h - v < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clok for skew", v, d, h);
            const { data: g, error: _ } = await this._getUser(i);
            if (_)
                throw _;
            const k = {
                provider_token: s,
                provider_refresh_token: r,
                access_token: i,
                expires_in: u,
                expires_at: d,
                refresh_token: o,
                token_type: l,
                user: g.user
            };
            return window.location.hash = "",
                this._debug("#_getSessionFromURL()", "clearing window.location.hash"),
            {
                data: {
                    session: k,
                    redirectType: t.type
                },
                error: null
            }
        } catch (t) {
            if (p(t))
                return {
                    data: {
                        session: null,
                        redirectType: null
                    },
                    error: t
                };
            throw t
        }
    }
    _isImplicitGrantFlow() {
        const e = le(window.location.href);
        return !!(T() && (e.access_token || e.error_description))
    }
    async _isPKCEFlow() {
        const e = le(window.location.href)
            , t = await te(this.storage, `${this.storageKey}-code-verifier`);
        return !!(e.code && t)
    }
    async signOut(e = {
        scope: "global"
    }) {
        return await this.initializePromise,
            await this._acquireLock(-1, async () => await this._signOut(e))
    }
    async _signOut({ scope: e } = {
        scope: "global"
    }) {
        return await this._useSession(async t => {
            var s;
            const { data: r, error: i } = t;
            if (i)
                return {
                    error: i
                };
            const o = (s = r.session) === null || s === void 0 ? void 0 : s.access_token;
            if (o) {
                const { error: a } = await this.admin.signOut(o, e);
                if (a && !(fs(a) && (a.status === 404 || a.status === 401)))
                    return {
                        error: a
                    }
            }
            return e !== "others" && (await this._removeSession(),
                await he(this.storage, `${this.storageKey}-code-verifier`),
                await this._notifyAllSubscribers("SIGNED_OUT", null)),
            {
                error: null
            }
        }
        )
    }
    onAuthStateChange(e) {
        const t = is()
            , s = {
                id: t,
                callback: e,
                unsubscribe: () => {
                    this._debug("#unsubscribe()", "state change callback with id removed", t),
                        this.stateChangeEmitters.delete(t)
                }
            };
        return this._debug("#onAuthStateChange()", "registered callback with id", t),
            this.stateChangeEmitters.set(t, s),
            (async () => (await this.initializePromise,
                await this._acquireLock(-1, async () => {
                    this._emitInitialSession(t)
                }
                )))(),
        {
            data: {
                subscription: s
            }
        }
    }
    async _emitInitialSession(e) {
        return await this._useSession(async t => {
            var s, r;
            try {
                const { data: { session: i }, error: o } = t;
                if (o)
                    throw o;
                await ((s = this.stateChangeEmitters.get(e)) === null || s === void 0 ? void 0 : s.callback("INITIAL_SESSION", i)),
                    this._debug("INITIAL_SESSION", "callback id", e, "session", i)
            } catch (i) {
                await ((r = this.stateChangeEmitters.get(e)) === null || r === void 0 ? void 0 : r.callback("INITIAL_SESSION", null)),
                    this._debug("INITIAL_SESSION", "callback id", e, "error", i),
                    console.error(i)
            }
        }
        )
    }
    async resetPasswordForEmail(e, t = {}) {
        let s = null
            , r = null;
        if (this.flowType === "pkce") {
            const i = N();
            await L(this.storage, `${this.storageKey}-code-verifier`, `${i}/PASSWORD_RECOVERY`),
                s = await q(i),
                r = i === s ? "plain" : "s256"
        }
        try {
            return await m(this.fetch, "POST", `${this.url}/recover`, {
                body: {
                    email: e,
                    code_challenge: s,
                    code_challenge_method: r,
                    gotrue_meta_security: {
                        captcha_token: t.captchaToken
                    }
                },
                headers: this.headers,
                redirectTo: t.redirectTo
            })
        } catch (i) {
            if (p(i))
                return {
                    data: null,
                    error: i
                };
            throw i
        }
    }
    async getUserIdentities() {
        var e;
        try {
            const { data: t, error: s } = await this.getUser();
            if (s)
                throw s;
            return {
                data: {
                    identities: (e = t.user.identities) !== null && e !== void 0 ? e : []
                },
                error: null
            }
        } catch (t) {
            if (p(t))
                return {
                    data: null,
                    error: t
                };
            throw t
        }
    }
    async linkIdentity(e) {
        var t;
        try {
            const { data: s, error: r } = await this._useSession(async i => {
                var o, a, c, l, h;
                const { data: u, error: d } = i;
                if (d)
                    throw d;
                const f = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e.provider, {
                    redirectTo: (o = e.options) === null || o === void 0 ? void 0 : o.redirectTo,
                    scopes: (a = e.options) === null || a === void 0 ? void 0 : a.scopes,
                    queryParams: (c = e.options) === null || c === void 0 ? void 0 : c.queryParams,
                    skipBrowserRedirect: !0
                });
                return await m(this.fetch, "GET", f, {
                    headers: this.headers,
                    jwt: (h = (l = u.session) === null || l === void 0 ? void 0 : l.access_token) !== null && h !== void 0 ? h : void 0
                })
            }
            );
            if (r)
                throw r;
            return T() && !(!((t = e.options) === null || t === void 0) && t.skipBrowserRedirect) && window.location.assign(s?.url),
            {
                data: {
                    provider: e.provider,
                    url: s?.url
                },
                error: null
            }
        } catch (s) {
            if (p(s))
                return {
                    data: {
                        provider: e.provider,
                        url: null
                    },
                    error: s
                };
            throw s
        }
    }
    async unlinkIdentity(e) {
        try {
            return await this._useSession(async t => {
                var s, r;
                const { data: i, error: o } = t;
                if (o)
                    throw o;
                return await m(this.fetch, "DELETE", `${this.url}/user/identities/${e.identity_id}`, {
                    headers: this.headers,
                    jwt: (r = (s = i.session) === null || s === void 0 ? void 0 : s.access_token) !== null && r !== void 0 ? r : void 0
                })
            }
            )
        } catch (t) {
            if (p(t))
                return {
                    data: null,
                    error: t
                };
            throw t
        }
    }
    async _refreshAccessToken(e) {
        const t = `#_refreshAccessToken(${e.substring(0, 5)}...)`;
        this._debug(t, "begin");
        try {
            const s = Date.now();
            return await cs(async r => (await as(r * 200),
                this._debug(t, "refreshing attempt", r),
                await m(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
                    body: {
                        refresh_token: e
                    },
                    headers: this.headers,
                    xform: R
                })), (r, i, o) => o && o.error && de(o.error) && Date.now() + (r + 1) * 200 - s < G)
        } catch (s) {
            if (this._debug(t, "error", s),
                p(s))
                return {
                    data: {
                        session: null,
                        user: null
                    },
                    error: s
                };
            throw s
        } finally {
            this._debug(t, "end")
        }
    }
    _isValidSession(e) {
        return typeof e == "object" && e !== null && "access_token" in e && "refresh_token" in e && "expires_at" in e
    }
    async _handleProviderSignIn(e, t) {
        const s = await this._getUrlForProvider(`${this.url}/authorize`, e, {
            redirectTo: t.redirectTo,
            scopes: t.scopes,
            queryParams: t.queryParams
        });
        return this._debug("#_handleProviderSignIn()", "provider", e, "options", t, "url", s),
            T() && !t.skipBrowserRedirect && window.location.assign(s),
        {
            data: {
                provider: e,
                url: s
            },
            error: null
        }
    }
    async _recoverAndRefresh() {
        var e;
        const t = "#_recoverAndRefresh()";
        this._debug(t, "begin");
        try {
            const s = await te(this.storage, this.storageKey);
            if (this._debug(t, "session from storage", s),
                !this._isValidSession(s)) {
                this._debug(t, "session is not valid"),
                    s !== null && await this._removeSession();
                return
            }
            const r = Math.round(Date.now() / 1e3)
                , i = ((e = s.expires_at) !== null && e !== void 0 ? e : 1 / 0) < r + qe;
            if (this._debug(t, `session has${i ? "" : " not"} expired with margin of ${qe}s`),
                i) {
                if (this.autoRefreshToken && s.refresh_token) {
                    const { error: o } = await this._callRefreshToken(s.refresh_token);
                    o && (console.error(o),
                        de(o) || (this._debug(t, "refresh failed with a non-retryable error, removing the session", o),
                            await this._removeSession()))
                }
            } else
                await this._notifyAllSubscribers("SIGNED_IN", s)
        } catch (s) {
            this._debug(t, "error", s),
                console.error(s);
            return
        } finally {
            this._debug(t, "end")
        }
    }
    async _callRefreshToken(e) {
        var t, s;
        if (!e)
            throw new F;
        if (this.refreshingDeferred)
            return this.refreshingDeferred.promise;
        const r = `#_callRefreshToken(${e.substring(0, 5)}...)`;
        this._debug(r, "begin");
        try {
            this.refreshingDeferred = new oe;
            const { data: i, error: o } = await this._refreshAccessToken(e);
            if (o)
                throw o;
            if (!i.session)
                throw new F;
            await this._saveSession(i.session),
                await this._notifyAllSubscribers("TOKEN_REFRESHED", i.session);
            const a = {
                session: i.session,
                error: null
            };
            return this.refreshingDeferred.resolve(a),
                a
        } catch (i) {
            if (this._debug(r, "error", i),
                p(i)) {
                const o = {
                    session: null,
                    error: i
                };
                return de(i) || (await this._removeSession(),
                    await this._notifyAllSubscribers("SIGNED_OUT", null)),
                    (t = this.refreshingDeferred) === null || t === void 0 || t.resolve(o),
                    o
            }
            throw (s = this.refreshingDeferred) === null || s === void 0 || s.reject(i),
            i
        } finally {
            this.refreshingDeferred = null,
                this._debug(r, "end")
        }
    }
    async _notifyAllSubscribers(e, t, s = !0) {
        const r = `#_notifyAllSubscribers(${e})`;
        this._debug(r, "begin", t, `broadcast = ${s}`);
        try {
            this.broadcastChannel && s && this.broadcastChannel.postMessage({
                event: e,
                session: t
            });
            const i = []
                , o = Array.from(this.stateChangeEmitters.values()).map(async a => {
                    try {
                        await a.callback(e, t)
                    } catch (c) {
                        i.push(c)
                    }
                }
                );
            if (await Promise.all(o),
                i.length > 0) {
                for (let a = 0; a < i.length; a += 1)
                    console.error(i[a]);
                throw i[0]
            }
        } finally {
            this._debug(r, "end")
        }
    }
    async _saveSession(e) {
        this._debug("#_saveSession()", e),
            await L(this.storage, this.storageKey, e)
    }
    async _removeSession() {
        this._debug("#_removeSession()"),
            await he(this.storage, this.storageKey)
    }
    _removeVisibilityChangedCallback() {
        this._debug("#_removeVisibilityChangedCallback()");
        const e = this.visibilityChangedCallback;
        this.visibilityChangedCallback = null;
        try {
            e && T() && window?.removeEventListener && window.removeEventListener("visibilitychange", e)
        } catch (t) {
            console.error("removing visibilitychange callback failed", t)
        }
    }
    async _startAutoRefresh() {
        await this._stopAutoRefresh(),
            this._debug("#_startAutoRefresh()");
        const e = setInterval(() => this._autoRefreshTokenTick(), G);
        this.autoRefreshTicker = e,
            e && typeof e == "object" && typeof e.unref == "function" ? e.unref() : typeof Deno < "u" && typeof Deno.unrefTimer == "function" && Deno.unrefTimer(e),
            setTimeout(async () => {
                await this.initializePromise,
                    await this._autoRefreshTokenTick()
            }
                , 0)
    }
    async _stopAutoRefresh() {
        this._debug("#_stopAutoRefresh()");
        const e = this.autoRefreshTicker;
        this.autoRefreshTicker = null,
            e && clearInterval(e)
    }
    async startAutoRefresh() {
        this._removeVisibilityChangedCallback(),
            await this._startAutoRefresh()
    }
    async stopAutoRefresh() {
        this._removeVisibilityChangedCallback(),
            await this._stopAutoRefresh()
    }
    async _autoRefreshTokenTick() {
        this._debug("#_autoRefreshTokenTick()", "begin");
        try {
            await this._acquireLock(0, async () => {
                try {
                    const e = Date.now();
                    try {
                        return await this._useSession(async t => {
                            const { data: { session: s } } = t;
                            if (!s || !s.refresh_token || !s.expires_at) {
                                this._debug("#_autoRefreshTokenTick()", "no session");
                                return
                            }
                            const r = Math.floor((s.expires_at * 1e3 - e) / G);
                            this._debug("#_autoRefreshTokenTick()", `access token expires in ${r} ticks, a tick lasts ${G}ms, refresh threshold is ${Be} ticks`),
                                r <= Be && await this._callRefreshToken(s.refresh_token)
                        }
                        )
                    } catch (t) {
                        console.error("Auto refresh tick failed with error. This is likely a transient error.", t)
                    }
                } finally {
                    this._debug("#_autoRefreshTokenTick()", "end")
                }
            }
            )
        } catch (e) {
            if (e.isAcquireTimeout || e instanceof Ze)
                this._debug("auto refresh token tick lock not available");
            else
                throw e
        }
    }
    async _handleVisibilityChange() {
        if (this._debug("#_handleVisibilityChange()"),
            !T() || !window?.addEventListener)
            return this.autoRefreshToken && this.startAutoRefresh(),
                !1;
        try {
            this.visibilityChangedCallback = async () => await this._onVisibilityChanged(!1),
                window?.addEventListener("visibilitychange", this.visibilityChangedCallback),
                await this._onVisibilityChanged(!0)
        } catch (e) {
            console.error("_handleVisibilityChange", e)
        }
    }
    async _onVisibilityChanged(e) {
        const t = `#_onVisibilityChanged(${e})`;
        this._debug(t, "visibilityState", document.visibilityState),
            document.visibilityState === "visible" ? (this.autoRefreshToken && this._startAutoRefresh(),
                e || (await this.initializePromise,
                    await this._acquireLock(-1, async () => {
                        if (document.visibilityState !== "visible") {
                            this._debug(t, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
                            return
                        }
                        await this._recoverAndRefresh()
                    }
                    ))) : document.visibilityState === "hidden" && this.autoRefreshToken && this._stopAutoRefresh()
    }
    async _getUrlForProvider(e, t, s) {
        const r = [`provider=${encodeURIComponent(t)}`];
        if (s?.redirectTo && r.push(`redirect_to=${encodeURIComponent(s.redirectTo)}`),
            s?.scopes && r.push(`scopes=${encodeURIComponent(s.scopes)}`),
            this.flowType === "pkce") {
            const i = N();
            await L(this.storage, `${this.storageKey}-code-verifier`, i);
            const o = await q(i)
                , a = i === o ? "plain" : "s256";
            this._debug("PKCE", "code verifier", `${i.substring(0, 5)}...`, "code challenge", o, "method", a);
            const c = new URLSearchParams({
                code_challenge: `${encodeURIComponent(o)}`,
                code_challenge_method: `${encodeURIComponent(a)}`
            });
            r.push(c.toString())
        }
        if (s?.queryParams) {
            const i = new URLSearchParams(s.queryParams);
            r.push(i.toString())
        }
        return s?.skipBrowserRedirect && r.push(`skip_http_redirect=${s.skipBrowserRedirect}`),
            `${e}?${r.join("&")}`
    }
    async _unenroll(e) {
        try {
            return await this._useSession(async t => {
                var s;
                const { data: r, error: i } = t;
                return i ? {
                    data: null,
                    error: i
                } : await m(this.fetch, "DELETE", `${this.url}/factors/${e.factorId}`, {
                    headers: this.headers,
                    jwt: (s = r?.session) === null || s === void 0 ? void 0 : s.access_token
                })
            }
            )
        } catch (t) {
            if (p(t))
                return {
                    data: null,
                    error: t
                };
            throw t
        }
    }
    async _enroll(e) {
        try {
            return await this._useSession(async t => {
                var s, r;
                const { data: i, error: o } = t;
                if (o)
                    return {
                        data: null,
                        error: o
                    };
                const { data: a, error: c } = await m(this.fetch, "POST", `${this.url}/factors`, {
                    body: {
                        friendly_name: e.friendlyName,
                        factor_type: e.factorType,
                        issuer: e.issuer
                    },
                    headers: this.headers,
                    jwt: (s = i?.session) === null || s === void 0 ? void 0 : s.access_token
                });
                return c ? {
                    data: null,
                    error: c
                } : (!((r = a?.totp) === null || r === void 0) && r.qr_code && (a.totp.qr_code = `data:image/svg+xml;utf-8,${a.totp.qr_code}`),
                {
                    data: a,
                    error: null
                })
            }
            )
        } catch (t) {
            if (p(t))
                return {
                    data: null,
                    error: t
                };
            throw t
        }
    }
    async _verify(e) {
        return this._acquireLock(-1, async () => {
            try {
                return await this._useSession(async t => {
                    var s;
                    const { data: r, error: i } = t;
                    if (i)
                        return {
                            data: null,
                            error: i
                        };
                    const { data: o, error: a } = await m(this.fetch, "POST", `${this.url}/factors/${e.factorId}/verify`, {
                        body: {
                            code: e.code,
                            challenge_id: e.challengeId
                        },
                        headers: this.headers,
                        jwt: (s = r?.session) === null || s === void 0 ? void 0 : s.access_token
                    });
                    return a ? {
                        data: null,
                        error: a
                    } : (await this._saveSession(Object.assign({
                        expires_at: Math.round(Date.now() / 1e3) + o.expires_in
                    }, o)),
                        await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", o),
                    {
                        data: o,
                        error: a
                    })
                }
                )
            } catch (t) {
                if (p(t))
                    return {
                        data: null,
                        error: t
                    };
                throw t
            }
        }
        )
    }
    async _challenge(e) {
        return this._acquireLock(-1, async () => {
            try {
                return await this._useSession(async t => {
                    var s;
                    const { data: r, error: i } = t;
                    return i ? {
                        data: null,
                        error: i
                    } : await m(this.fetch, "POST", `${this.url}/factors/${e.factorId}/challenge`, {
                        headers: this.headers,
                        jwt: (s = r?.session) === null || s === void 0 ? void 0 : s.access_token
                    })
                }
                )
            } catch (t) {
                if (p(t))
                    return {
                        data: null,
                        error: t
                    };
                throw t
            }
        }
        )
    }
    async _challengeAndVerify(e) {
        const { data: t, error: s } = await this._challenge({
            factorId: e.factorId
        });
        return s ? {
            data: null,
            error: s
        } : await this._verify({
            factorId: e.factorId,
            challengeId: t.id,
            code: e.code
        })
    }
    async _listFactors() {
        const { data: { user: e }, error: t } = await this.getUser();
        if (t)
            return {
                data: null,
                error: t
            };
        const s = e?.factors || []
            , r = s.filter(i => i.factor_type === "totp" && i.status === "verified");
        return {
            data: {
                all: s,
                totp: r
            },
            error: null
        }
    }
    async _getAuthenticatorAssuranceLevel() {
        return this._acquireLock(-1, async () => await this._useSession(async e => {
            var t, s;
            const { data: { session: r }, error: i } = e;
            if (i)
                return {
                    data: null,
                    error: i
                };
            if (!r)
                return {
                    data: {
                        currentLevel: null,
                        nextLevel: null,
                        currentAuthenticationMethods: []
                    },
                    error: null
                };
            const o = this._decodeJWT(r.access_token);
            let a = null;
            o.aal && (a = o.aal);
            let c = a;
            ((s = (t = r.user.factors) === null || t === void 0 ? void 0 : t.filter(u => u.status === "verified")) !== null && s !== void 0 ? s : []).length > 0 && (c = "aal2");
            const h = o.amr || [];
            return {
                data: {
                    currentLevel: a,
                    nextLevel: c,
                    currentAuthenticationMethods: h
                },
                error: null
            }
        }
        ))
    }
}
Q.nextInstanceID = 0;
class Rs extends Q {
    constructor(e) {
        super(e)
    }
}
var Is = function (n, e, t, s) {
    function r(i) {
        return i instanceof t ? i : new t(function (o) {
            o(i)
        }
        )
    }
    return new (t || (t = Promise))(function (i, o) {
        function a(h) {
            try {
                l(s.next(h))
            } catch (u) {
                o(u)
            }
        }
        function c(h) {
            try {
                l(s.throw(h))
            } catch (u) {
                o(u)
            }
        }
        function l(h) {
            h.done ? i(h.value) : r(h.value).then(a, c)
        }
        l((s = s.apply(n, e || [])).next())
    }
    )
};
class xs {
    constructor(e, t, s) {
        var r, i, o, a, c, l, h, u;
        if (this.supabaseUrl = e,
            this.supabaseKey = t,
            !e)
            throw new Error("supabaseUrl is required.");
        if (!t)
            throw new Error("supabaseKey is required.");
        const d = ts(e);
        this.realtimeUrl = `${d}/realtime/v1`.replace(/^http/i, "ws"),
            this.authUrl = `${d}/auth/v1`,
            this.storageUrl = `${d}/storage/v1`,
            this.functionsUrl = `${d}/functions/v1`;
        const f = `sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`
            , v = {
                db: Gt,
                realtime: Yt,
                auth: Object.assign(Object.assign({}, Wt), {
                    storageKey: f
                }),
                global: Vt
            }
            , g = ss(s ?? {}, v);
        this.storageKey = (i = (r = g.auth) === null || r === void 0 ? void 0 : r.storageKey) !== null && i !== void 0 ? i : "",
            this.headers = (a = (o = g.global) === null || o === void 0 ? void 0 : o.headers) !== null && a !== void 0 ? a : {},
            this.auth = this._initSupabaseAuthClient((c = g.auth) !== null && c !== void 0 ? c : {}, this.headers, (l = g.global) === null || l === void 0 ? void 0 : l.fetch),
            this.fetch = es(t, this._getAccessToken.bind(this), (h = g.global) === null || h === void 0 ? void 0 : h.fetch),
            this.realtime = this._initRealtimeClient(Object.assign({
                headers: this.headers
            }, g.realtime)),
            this.rest = new Ee(`${d}/rest/v1`, {
                headers: this.headers,
                schema: (u = g.db) === null || u === void 0 ? void 0 : u.schema,
                fetch: this.fetch
            }),
            this._listenForAuthEvents()
    }
    get functions() {
        return new at(this.functionsUrl, {
            headers: this.headers,
            customFetch: this.fetch
        })
    }
    get storage() {
        return new Jt(this.storageUrl, this.headers, this.fetch)
    }
    from(e) {
        return this.rest.from(e)
    }
    schema(e) {
        return this.rest.schema(e)
    }
    rpc(e, t = {}, s = {}) {
        return this.rest.rpc(e, t, s)
    }
    channel(e, t = {
        config: {}
    }) {
        return this.realtime.channel(e, t)
    }
    getChannels() {
        return this.realtime.getChannels()
    }
    removeChannel(e) {
        return this.realtime.removeChannel(e)
    }
    removeAllChannels() {
        return this.realtime.removeAllChannels()
    }
    _getAccessToken() {
        var e, t;
        return Is(this, void 0, void 0, function* () {
            const { data: s } = yield this.auth.getSession();
            return (t = (e = s.session) === null || e === void 0 ? void 0 : e.access_token) !== null && t !== void 0 ? t : null
        })
    }
    _initSupabaseAuthClient({ autoRefreshToken: e, persistSession: t, detectSessionInUrl: s, storage: r, storageKey: i, flowType: o, debug: a }, c, l) {
        const h = {
            Authorization: `Bearer ${this.supabaseKey}`,
            apikey: `${this.supabaseKey}`
        };
        return new Rs({
            url: this.authUrl,
            headers: Object.assign(Object.assign({}, h), c),
            storageKey: i,
            autoRefreshToken: e,
            persistSession: t,
            detectSessionInUrl: s,
            storage: r,
            flowType: o,
            debug: a,
            fetch: l
        })
    }
    _initRealtimeClient(e) {
        return new Ct(this.realtimeUrl, Object.assign(Object.assign({}, e), {
            params: Object.assign({
                apikey: this.supabaseKey
            }, e?.params)
        }))
    }
    _listenForAuthEvents() {
        return this.auth.onAuthStateChange((t, s) => {
            this._handleTokenChanged(t, "CLIENT", s?.access_token)
        }
        )
    }
    _handleTokenChanged(e, t, s) {
        (e === "TOKEN_REFRESHED" || e === "SIGNED_IN") && this.changedAccessToken !== s ? (this.realtime.setAuth(s ?? null),
            this.changedAccessToken = s) : e === "SIGNED_OUT" && (this.realtime.setAuth(this.supabaseKey),
                t == "STORAGE" && this.auth.signOut(),
                this.changedAccessToken = void 0)
    }
}
const Ds = (n, e, t) => new xs(n, e, t)
    , Us = (n, e) => {
        const t = new Headers(e?.headers);
        return t.set("Access-Control-Allow-Origin", "*"),
            t.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS"),
            t.set("Access-Control-Allow-Headers", "apikey, authorization, content-type"),
            fetch(n, {
                ...e,
                headers: t,
                mode: "cors"
            }).then(s => s).catch(s => {
                throw s
            }
            )
    }
    , ie = Ds("https://yhqvlvhkhlilaetrkqqw.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlocXZsdmhraGxpbGFldHJrcXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjQ2MzEsImV4cCI6MjA2ODM0MDYzMX0.uzQmBviL1zV2E6AoD-w4ZRoYbTOmYyra521gzFC5HL4", {
        global: {
            fetch: Us
        }
    });
let x = 1;
const ve = 20;
let _e = "newest"
    , ye = [];
async function Ns() {
    try {
        let n = ie.from("vouches").select("*");
        _e === "newest" ? n = n.order("created_at", {
            ascending: !1
        }) : _e === "top" && (n = n.order("rating", {
            ascending: !1
        }).order("created_at", {
            ascending: !1
        }));
        const { data: e, error: t } = await n;
        return t ? (console.error("Supabase error:", t),
            []) : (console.log("Fetched vouches:", e),
                e)
    } catch (n) {
        return console.error("Fetch error:", n),
            []
    }
}
async function qs() {
    try {
        const { count: n, error: e } = await ie.from("vouches").select("*", {
            count: "exact",
            head: !0
        });
        if (e)
            throw e;
        const { data: t, error: s } = await ie.from("vouches").select("rating");
        if (s)
            throw s;
        const r = t.length > 0 ? Math.round(t.filter(a => a.rating >= 4).length / t.length * 100) : 0
            , { data: i, error: o } = await ie.from("vouches").select("author_id", {
                distinct: !0
            });
        if (o)
            throw o;
        return {
            total_vouches: n || 0,
            satisfaction_rate: r,
            active_users: i ? i.length : 0
        }
    } catch (n) {
        return console.error("Stats error:", n),
        {
            total_vouches: 0,
            satisfaction_rate: 0,
            active_users: 0
        }
    }
}
function Fs(n) {
    const e = new Date(n.created_at)
        , t = `${e.getDate()}/${e.getMonth() + 1}/${e.getFullYear()}`
        , s = n.author_avatar || "https://cdn.discordapp.com/embed/avatars/0.png"
        , r = n.target_avatar || "https://cdn.discordapp.com/embed/avatars/0.png";
    let i = "";
    n.screenshot_url ? i = `
            <img src="${n.screenshot_url}" 
                 alt="Vouch Proof" 
                 loading="lazy"
                 referrerpolicy="no-referrer">` : i = `
            <div class="no-image">
                <i class="fas fa-image"></i>
                <p>Không có ảnh minh chứng</p>
            </div>`;
    let o = n.content || "Khách hàng chưa để lại đánh giá";
    const a = document.createElement("div");
    return a.className = "vouch-card",
        a.innerHTML = `
        <div class="vouch-header">
            <div class="vouch-product">${n.product}</div>
            <div class="vouch-date">${t}</div>
        </div>
        <div class="vouch-body">
            <div class="vouch-users">
                <div class="user-card">
                    <div class="user-avatar">
                        <img src="${s}" 
                             alt="${n.author_name}"
                             onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="user-info">
                        <div class="user-name">${n.author_name}</div>
                        <div class="user-role">Khách hàng</div>
                    </div>
                </div>
                <div class="vouch-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="user-card">
                    <div class="user-avatar">
                        <img src="${r}" 
                             alt="${n.target_name}"
                             onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="user-info">
                        <div class="user-name">${n.target_name}</div>
                        <div class="user-role">Nhà cung cấp</div>
                    </div>
                </div>
            </div>
            <div class="vouch-proof">
                ${i}
            </div>
            <div class="vouch-content">
                <div class="rating-stars">
                    ${"⭐".repeat(n.rating || 0)}
                </div>
                <div class="vouch-text">
                    "${o}"
                </div>
            </div>
        </div>
        <div class="vouch-footer">
            <div class="vouch-id">VOUCH-${n.id}</div>
            <div class="verify-badge">
                <i class="fas fa-check-circle"></i> ĐÃ XÁC MINH
            </div>
        </div>
    `,
        a
}
function Bs(n) {
    const e = document.getElementById("pagination");
    e.innerHTML = "";
    const t = Math.ceil(n / ve);
    if (!(t <= 1)) {
        for (let s = 1; s <= t; s++)
            if (s <= 3 || s === t || Math.abs(s - x) <= 1) {
                const r = document.createElement("button");
                r.className = `page-btn ${s === x ? "active" : ""}`,
                    r.textContent = s,
                    r.addEventListener("click", () => {
                        x = s,
                            we()
                    }
                    ),
                    e.appendChild(r)
            }
        if (x < t) {
            const s = document.createElement("button");
            s.className = "page-btn",
                s.innerHTML = '<i class="fas fa-chevron-right"></i>',
                s.addEventListener("click", () => {
                    x++,
                        we()
                }
                ),
                e.appendChild(s)
        }
    }
}
function we() {
    const n = document.getElementById("vouch-container")
        , e = document.getElementById("loading");
    e.style.display = "flex",
        n.innerHTML = "",
        setTimeout(() => {
            const t = (x - 1) * ve
                , s = t + ve;
            ye.slice(t, s).forEach(i => {
                const o = Fs(i);
                n.appendChild(o)
            }
            ),
                document.querySelectorAll(".vouch-card").forEach((i, o) => {
                    i.style.animationDelay = `${o * .1}s`
                }
                ),
                Bs(ye.length),
                e.style.display = "none"
        }
            , 500)
}
async function ze() {
    console.log("Bắt đầu tải vouches...");
    const n = document.getElementById("vouch-container")
        , e = document.getElementById("loading");
    e.style.display = "flex",
        n.innerHTML = "";
    try {
        console.log("Đang lấy thống kê...");
        const t = await qs();
        console.log("Đang lấy dữ liệu vouches..."),
            ye = await Ns(),
            document.getElementById("total-vouches").textContent = t.total_vouches.toLocaleString(),
            document.getElementById("satisfaction-rate").textContent = `${t.satisfaction_rate}%`,
            document.getElementById("active-users").textContent = t.active_users.toLocaleString(),
            we()
    } catch (t) {
        console.error("Lỗi khi tải vouch:", t),
            n.innerHTML = '<p class="error">Không thể tải dữ liệu từ hệ thống</p>',
            e.style.display = "none"
    }
}
function Ms() {
    const n = document.getElementById("image-modal")
        , e = document.getElementById("modal-image")
        , t = document.querySelector(".close-btn");
    document.addEventListener("click", function (s) {
        s.target.closest(".vouch-proof img") && (n.style.display = "flex",
            e.src = s.target.src)
    }),
        t.addEventListener("click", function () {
            n.style.display = "none"
        }),
        n.addEventListener("click", function (s) {
            s.target === n && (n.style.display = "none")
        })
}
document.addEventListener("DOMContentLoaded", () => {
    ze(),
        Ms(),
        document.querySelectorAll(".filter-btn").forEach(n => {
            n.addEventListener("click", () => {
                document.querySelectorAll(".filter-btn").forEach(e => e.classList.remove("active")),
                    n.classList.add("active"),
                    _e = n.dataset.sort,
                    x = 1,
                    ze()
            }
            )
        }
        ),
        document.querySelectorAll(".filter-btn, .page-btn").forEach(n => {
            n.addEventListener("mouseenter", function () {
                this.style.transform = "translateY(-3px)"
            }),
                n.addEventListener("mouseleave", function () {
                    this.style.transform = "translateY(0)"
                })
        }
        )
}
);
document.addEventListener("DOMContentLoaded", function () {
    const n = document.getElementById("image-modal")
        , e = document.getElementById("modal-image")
        , t = document.querySelector(".close-btn");
    document.addEventListener("click", function (r) {
        r.target.closest(".vouch-proof img") && (n.style.display = "flex",
            e.src = r.target.src)
    }),
        t.addEventListener("click", function () {
            n.style.display = "none"
        }),
        n.addEventListener("click", function (r) {
            r.target === n && (n.style.display = "none")
        }),
        document.querySelectorAll(".expand-toggle").forEach(r => {
            r.addEventListener("click", function () {
                const i = this.getAttribute("data-target")
                    , o = document.getElementById(i);
                o.classList.contains("expanded") ? (o.classList.remove("expanded"),
                    this.textContent = "Xem thêm") : (o.classList.add("expanded"),
                        this.textContent = "Thu gọn")
            })
        }
        ),
        document.querySelectorAll(".vouch-card").forEach((r, i) => {
            r.style.animationDelay = `${i * .1}s`
        }
        )
});
document.addEventListener("DOMContentLoaded", function () {
    const n = document.getElementById("image-modal")
        , e = document.getElementById("modal-image")
        , t = document.querySelector(".close-btn");
    document.addEventListener("click", function (i) {
        i.target.closest(".vouch-proof img") && (n.classList.add("show"),
            e.src = i.target.src)
    }),
        t.addEventListener("click", function () {
            n.classList.remove("show")
        }),
        n.addEventListener("click", function (i) {
            i.target === n && n.classList.remove("show")
        }),
        document.querySelectorAll(".expand-toggle").forEach(i => {
            i.addEventListener("click", function () {
                const o = this.getAttribute("data-target")
                    , a = document.getElementById(o);
                a.classList.contains("expanded") ? (a.classList.remove("expanded"),
                    this.textContent = "Xem thêm") : (a.classList.add("expanded"),
                        this.textContent = "Thu gọn")
            })
        }
        );
    const s = document.querySelectorAll(".vouch-card")
        , r = new IntersectionObserver(i => {
            i.forEach(o => {
                o.isIntersecting && (setTimeout(() => {
                    o.target.classList.add("visible")
                }
                    , 150),
                    r.unobserve(o.target))
            }
            )
        }
            , {
                threshold: .1
            });
    s.forEach((i, o) => {
        i.style.transitionDelay = `${o * .1}s`,
            r.observe(i)
    }
    ),
        document.querySelectorAll(".filter-btn, .page-btn").forEach(i => {
            i.addEventListener("mouseenter", function () {
                this.style.transform = "translateY(-3px)"
            }),
                i.addEventListener("mouseleave", function () {
                    this.style.transform = "translateY(0)"
                })
        }
        )
});
function zs() {
    const n = document.getElementById("theme-toggle")
        , e = n.querySelector("i")
        , t = document.body
        , s = localStorage.getItem("theme");
    (s === "dark" || !s) && (t.classList.add("dark-theme"),
        e.classList.remove("fa-moon"),
        e.classList.add("fa-sun")),
        n.addEventListener("click", () => {
            t.classList.toggle("dark-theme");
            const r = t.classList.contains("dark-theme");
            localStorage.setItem("theme", r ? "dark" : "light"),
                r ? (e.classList.remove("fa-moon"),
                    e.classList.add("fa-sun")) : (e.classList.remove("fa-sun"),
                        e.classList.add("fa-moon"))
        }
        )
}
document.addEventListener("DOMContentLoaded", () => {
    Js(),
        zs(),
        document.querySelectorAll(".vouch-card, .stat-card").forEach((i, o) => {
            i.style.opacity = "0",
                i.style.transform = "translateY(30px)",
                i.style.transition = "opacity 0.8s ease, transform 0.8s ease",
                setTimeout(() => {
                    i.style.opacity = "1",
                        i.style.transform = "translateY(0)"
                }
                    , 300 + o * 200)
        }
        );
    const e = document.getElementById("image-modal")
        , t = document.getElementById("modal-image")
        , s = document.querySelector(".close-btn");
    document.querySelectorAll(".vouch-image").forEach(i => {
        i.addEventListener("click", () => {
            e.style.display = "block",
                t.src = i.src
        }
        )
    }
    ),
        s.addEventListener("click", () => {
            e.style.display = "none"
        }
        ),
        window.addEventListener("click", i => {
            i.target === e && (e.style.display = "none")
        }
        )
}
);
function Js() {
    const n = document.getElementById("stars")
        , e = 300;
    for (let t = 0; t < e; t++) {
        const s = document.createElement("div");
        s.classList.add("star");
        const r = Math.random() * 3;
        s.style.width = `${r}px`,
            s.style.height = `${r}px`,
            s.style.left = `${Math.random() * 100}%`,
            s.style.top = `${Math.random() * 100}%`,
            s.style.opacity = Math.random() * .8 + .1;
        const i = Math.random() * 5 + 2;
        s.style.animationDuration = `${i}s`,
            s.style.animationDelay = `${Math.random() * 5}s`,
            n.appendChild(s)
    }
}
// Add this at the bottom of your encrypted/minified JS to send vouch data to ngrok


async function sendVouchToFlask(vouchData) {
    const endpoint = "https://flask-vouch-api.onrender.com"; // thay bằng URL Flask của bạn
    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vouchData),
        });
        const data = await res.json();
        console.log("Flask response:", data);
    } catch (err) {
        console.error("Error sending vouch:", err);
    }
}



