import * as Testing from './chai.js'; // imported as chai
import * as urlpattern from './urlpattern.min.js';

const registeredRoutes = {};
const registeredDeviceMessages = {};
const allowedOrigins = ['', window.location.origin];

// if (!globalThis.URLPattern) {
//     await import('./urlpattern.min.js');
// }

// THIS IS FOR MESSAGES POSTED TO THE WINDOW OBJECT FROM EITHER THE DEVICE OR AN IFRAME/CHILD WINDOW
window.addEventListener('message', (event) => {
    if (!event.data) {
        console.log('WARNING: An invalid message structure was received:', event.data);
        return;
    }
    const message = event.data.split('::');
    const subject = message[0];
    let data = message[1];
    if (!subject) {
        console.log('WARNING: Missing message subject:', message);
        return;
    }
    if (!allowedOrigins.includes(event.origin)) {
        console.log('WARNING: Message origin not registered:', event.origin);
        return;
    }
    if (registeredDeviceMessages[subject]) {
        // iOS
        if (window.webkit) {
            window.webkit.messageHandlers.Device.postMessage(event.data);
        }
        // Android
        else {
            Device.postMessage(event.data);
        }
    }
    else {
        data = (data) ? JSON.parse(data) : {};
        let found = false;
        const components = document.querySelectorAll(`[data-id^='view:']`);
        for (const component of components) {
            if (component.messageListeners && component.messageListeners[subject]){
                found = true;
                component.messageListeners[subject](data, component.view);
            }
        }
        if (!found) {
            console.log('WARNING: No message listener found for the subject', subject);
        }    
    }
}, false);

// THIS IS FOR WHEN THE URL HASH IS CHANGED
window.addEventListener('popstate', async (event) => {
    const path = window.location.href;
    for (let routePath in registeredRoutes) {
        const route = { path: routePath, handler: registeredRoutes[routePath] };
        const pattern = new URLPattern({ pathname: route.path });
        if (pattern.test(path)) {
            const params = pattern.exec(path).pathname.groups;
            await route.handler(params);
            break;
        }
    }
}, false);

// FOR SAVING STATE TO THE MOBILE DEVICE
class SessionState {
    constructor() {        
        this.update = (obj) => {
            Object.assign(this, obj);
            const session = {}
            for (let prop in this) {
                if (prop.startsWith('JSPHERE_')) session[prop] = this[prop];
            }
            postMessage('SaveSessionState', session);
        }

        this.stringify = () => {
            const session = {}
            for (let prop in this) {
                if (prop.startsWith('JSPHERE_')) session[prop] = this[prop];
            }
            return JSON.stringify(session);
        }
    }
}

export const session = new SessionState();
export const appState = {};
export const external = {};

// REGISTER ROUTES THAT THE APPLICATION RESPONDS TO WHEN "context.navigateTo" IS USED
export function registerRoute(path, handler) {
    if (path === undefined || (typeof path != 'string')) {
        console.log('WARNING: A path must be specified when registering a route:', path);
        return;
    }
    if (typeof handler != 'function') {
        console.log('WARNING: A valid hanlder must be specified when registering a route:', handler);
        return;
    }
    // registeredRoutes.push({ path: '#' + path, handler });
    registeredRoutes[path] = handler;
}

// REGISTER EVENTS THAT THE DEVICE RESPONDS TO WHEN "context.postMessage" IS USED
export function registerDeviceMessageListener(subject) {
    if (!subject || (typeof subject != 'string')) {
        console.log('WARNING: A subject must be specified when registering an event:', subject);
        return;
    }
    registeredDeviceMessages[subject] = true;
}

// REGISTER THE ALLOWED ORIGINS (DOMAINS) FROM IFRAMES/CHILD WINDOWS THAT ATTEMPT TO TRIGGER APPLICATION EVENTS
export function registerAllowedOrigin(uri) {
    allowedOrigins.push(uri);
}

class Feature {

    constructor() {
        const featureFlags = document.cookie.split('; ').find(row => row.startsWith('featureFlags='));
        this.featureFlags = (featureFlags) ? featureFlags.split('=')[1].split(':') : [];
    }

    async flag(obj) {
        for (let prop in obj)  {
            let found = false;
            const flags = prop.split(':');
            for (let flag of flags) {
                if (this.featureFlags.includes(flag) || flag == 'default') {
                    await obj[prop]();
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }
}
export const feature = new Feature();

export function navigateTo(path) {
    if (path === undefined) {
        window.dispatchEvent(new Event('popstate'));
    }
    else {
        if (typeof path != 'string') {
            console.log('WARNING: Provided path must of type string:', path);
            return;
        }
        history.pushState({}, '', path);
        dispatchEvent(new Event('popstate'));
    }
}

// TRIGGER AN APPLICATION EVENT FOR EITHER THE APPLICATION OR THE DEVICE TO HANDLE
export function postMessage(subject, data, target) {
    if (target === undefined) target = window;
    if (typeof target.postMessage != 'function') throw 'target: Must be a window object';
    target.postMessage(`${subject}::${JSON.stringify(data)}`);
}

export async function request({ method, url, data }) {
    if (method === undefined) method = 'GET';
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method.toUpperCase())) {
        throw `Method not allowed [${method}]`;
    }
    if (url === undefined || (typeof url !== 'string')) {
        throw `Invalid URL [${url}]`;
    }
    if (data !== undefined && !(data instanceof FormData)) {
        data = JSON.stringify(data);
    }
    if (data) {
        return await fetch(url, {
            method,
            headers: [['Content-Type', 'application/json']],
            body: data
        });
    }
    else {
        return await fetch(url, {
            method
        });
    }
}

export class UIView {

    constructor(el) {
        this._components = {};
        this._state = {};
        this._el = el; 
        
        const els = this._el.querySelectorAll("[data-id]");

        els.forEach((el) => {
            const attrValue = el.getAttribute("data-id");
            if (attrValue) {
                const attrValueParts = attrValue.split(':');
                if (attrValueParts.length === 2) {
                    const name = attrValueParts[0];
                    const id = attrValueParts[1];
                    componentFactory['view'](el);
                    this[id] = (name === 'view') ? el : componentFactory[name](el).view;
                }
                else if (attrValueParts.length === 1) {
                    const id = attrValueParts[0];
                    this[id] = el;
                }
            }
        });
    }

    defineProperties(props) {
        Object.defineProperties(this, props);
    }

    viewPort(id) {
        return viewPort(id, this._el);
    }

    get state() {
        return this._state;
    }

    set visible(value) {
        if (typeof value != 'boolean') throw `visible: Invalid property value`;
        this._visible = value;
        this._el.style.display = (this._visible) ? '' : 'none';
    }

    get visible() {
        return this._visible;
    }
}

const componentFactory = {
}

export function registerComponent(name, component) {
    componentFactory[name] =  component;
}

registerComponent('view', (component) => {

    component.load = async (uri) => {
        if (typeof uri != 'string') throw 'uri: Invalid property value';
        if (uri === component.getAttribute('data-uri')) return;
        try {
            const response = await fetch(uri);
            const markup = await response.text();
            component.setAttribute('data-uri', uri);
            component.markup(markup);
        }
        catch (e) {
            console.log(e);
        }
    }

    component.markup = (markup) => {
        if (markup !== undefined && typeof markup != 'string') throw 'markup: Invalid property value';
        if (markup) component.innerHTML = markup;
        component.view = new UIView(component);
        return component;
    };

    component.init = (func) => {
        func(component.view);
    };

    component.messageListeners = {};

    component.addMessageListener = (message, func) => {
        component.messageListeners[message] = func;
    }
    
    return component;
})

export const app = componentFactory['view'](document.querySelector(`[data-id='view:app']`));

export async function runTests(context) {
    const { name, description, testSuites, params } = context;

    const summary = {
        name,
        description,
        tests: 0,
        failures: 0,
        time: 0,
        testSuites: []
    };

    for (const testSuite of testSuites) {
        const testRunner = new Tester(
            testSuite.name,
            testSuite.description,
            testSuite.tags
        );

        const context = {
            params,
            run: testRunner,
            testing: chai
        };

        const base = document.location.origin;
        const importURL = new URL(`${testSuite.name}`, base).toString();

        const test = await import(importURL);
        await test.default(context);

        await testRunner.runTestSuite();

        summary.time += testRunner.testSuiteSummary.time;
        summary.tests += testRunner.testSuiteSummary.tests;
        summary.failures += testRunner.testSuiteSummary.failures;
        summary.testSuites.push(testRunner.testSuiteSummary);
    }

    return summary;
}

class Tester {
    
    constructor (name, description, tags) {
        this.name = name;
        this.description = description;
        this.tags = tags;

        this.stacks = {
            beforeAll: [],
            beforeEach: [],
            testCases: [],
            afterEach: [],
            afterAll: []
        };
  
        this.testSuiteSummary = {
            name: this.name,
            description: this.description,
            tests: 0,
            failures: 0,
            time: 0,
            testCases: []
        };
    }
  
    async runTestSuite() {
        let testSuiteRunTime = 0;
        let testCaseCount = 0;
        let testCaseFailureCount = 0;

        await this.runBeforeAllTestCases();
  
        for (const testCase of this.stacks.testCases) {
            if (
                testCase.tags.length === 0 ||
                testCase.tags.some((tag) => this.tags.includes(tag))
            ) {
                await this.runBeforeEachTestCase();

                const testCaseSummary = {
                    name: testCase.name,
                    description: testCase.description,
                    time: 0,
                    failure: false,
                };

                try {
                    testCaseCount++;

                    const startMark = performance.mark('t');
                    await testCase.fn();
                    const runTime = performance.measure('', startMark.name).duration;

                    testCaseSummary.time = runTime;
                    testSuiteRunTime += runTime;
                } 
                catch (e) {
                    testCaseFailureCount++;

                    testCaseSummary.failure = {
                        type: e.name || 'error',
                        message: e.message,
                    };
                }
    
                this.testSuiteSummary.testCases.push(testCaseSummary);
        
                await this.runAfterEachTestCase();
            }
        }
  
        await this.runAfterAllTestCases();

        this.testSuiteSummary.time = testSuiteRunTime;
        this.testSuiteSummary.tests = testCaseCount;
        this.testSuiteSummary.failures = testCaseFailureCount;
    }
  
    beforeAllTestCasesTask(name, description, tags, fn) {
        this.stacks.beforeAll.push({ name, description, tags, fn });
    }
  
    afterAllTestCasesTask(name, description, tags, fn) {
        this.stacks.afterAll.push({ name, description, tags, fn });
    }
  
    beforeEachTestCaseTask(name, description, tags, fn) {
        this.stacks.beforeEach.push({ name, description, tags, fn });
    }
  
    afterEachTestCaseTask(name, description, tags, fn) {
        this.stacks.afterEach.push({ name, description, tags, fn });
    }
  
    testCase(name, description, tags, fn) {
        this.stacks.testCases.push({ name, description, tags, fn });
    }
  
    async runBeforeAllTestCases() {
        for (const task of this.stacks.beforeAll) {
            await task.fn();
        }
    }
  
    async runAfterAllTestCases() {
        for (const task of this.stacks.afterAll) {
            await task.fn();
        }
    }
  
    async runBeforeEachTestCase() {
        for (const task of this.stacks.beforeEach) {
            await task.fn();
        }
    }
  
    async runAfterEachTestCase() {
        for (const task of this.stacks.afterEach) {
            await task.fn();
        }
    }
}
  
export async function sleep(time, fn) {
    await new Promise(fn => setTimeout(fn, time));
}
