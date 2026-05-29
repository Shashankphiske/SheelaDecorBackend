class GeneralFactory {
    static create(Repo, Service, Controller) {
        const repo = new Repo();
        const service = new Service(repo);
        const controller = new Controller(service);
        return controller;
    }
}
export { GeneralFactory };
//# sourceMappingURL=general.factory.js.map