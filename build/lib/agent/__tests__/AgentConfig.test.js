"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConnectionService_test_1 = require("../../protocols/connections/ConnectionService.test");
const DidDoc_1 = require("../../protocols/connections/domain/DidDoc");
const AgentConfig_1 = require("../AgentConfig");
describe('AgentConfig', () => {
    describe('getEndpoint', () => {
        it('should return the service endpoint of the inbound connection available', () => {
            const agentConfig = new AgentConfig_1.AgentConfig({
                label: 'test',
                walletConfig: { id: 'test' },
                walletCredentials: { key: 'test' },
            });
            const endpoint = 'https://mediator-url.com';
            agentConfig.establishInbound({
                verkey: 'test',
                connection: ConnectionService_test_1.getMockConnection({
                    theirDidDoc: new DidDoc_1.DidDoc('test', [], [], [new DidDoc_1.Service('test', endpoint, [], [], 1, 'type')]),
                }),
            });
            expect(agentConfig.getEndpoint()).toBe(endpoint);
        });
        it('should return the config endpoint + /msg if no inbound connection is available', () => {
            const endpoint = 'https://local-url.com';
            const agentConfig = new AgentConfig_1.AgentConfig({
                endpoint,
                label: 'test',
                walletConfig: { id: 'test' },
                walletCredentials: { key: 'test' },
            });
            expect(agentConfig.getEndpoint()).toBe(endpoint + '/msg');
        });
        it('should return the config host + /msg if no inbound connection or config endpoint is available', () => {
            const host = 'https://local-url.com';
            const agentConfig = new AgentConfig_1.AgentConfig({
                host,
                label: 'test',
                walletConfig: { id: 'test' },
                walletCredentials: { key: 'test' },
            });
            expect(agentConfig.getEndpoint()).toBe(host + '/msg');
        });
        it('should return the config host and port + /msg if no inbound connection or config endpoint is available', () => {
            const host = 'https://local-url.com';
            const port = 8080;
            const agentConfig = new AgentConfig_1.AgentConfig({
                host,
                port,
                label: 'test',
                walletConfig: { id: 'test' },
                walletCredentials: { key: 'test' },
            });
            expect(agentConfig.getEndpoint()).toBe(`${host}:${port}/msg`);
        });
        // added because on first implementation this is what it did. Never again!
        it('should return the endpoint + /msg without port if the endpoint and port are available', () => {
            const endpoint = 'https://local-url.com';
            const port = 8080;
            const agentConfig = new AgentConfig_1.AgentConfig({
                endpoint,
                port,
                label: 'test',
                walletConfig: { id: 'test' },
                walletCredentials: { key: 'test' },
            });
            expect(agentConfig.getEndpoint()).toBe(`${endpoint}/msg`);
        });
        it("should return 'didcomm:transport/queue' if no inbound connection or config endpoint or host/port is available", () => {
            const agentConfig = new AgentConfig_1.AgentConfig({
                label: 'test',
                walletConfig: { id: 'test' },
                walletCredentials: { key: 'test' },
            });
            expect(agentConfig.getEndpoint()).toBe('didcomm:transport/queue');
        });
    });
});
