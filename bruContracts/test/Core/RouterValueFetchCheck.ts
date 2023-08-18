import {expect} from "chai";
import {deploy, PROXIES} from "./../shared/deploy";

describe("Router Tests", async () => {
    before(async function () {
        await deploy();
    });
    it("Initialize tests", async () => {
        expect(true).to.equals(true);
    });

    it("get pool details for a given index", async () => {
        let poolDetails = await PROXIES.BruRouterProxy.getPoolDetails(0);
        expect(poolDetails[0]).to.equal("IndiaAgro");
    });
    it("get all  pool details ", async () => {
        let poolDetails = await PROXIES.BruRouterProxy.getAllPoolDetails();
        expect(poolDetails[0][0]).to.equal("IndiaAgro");
    });
});
