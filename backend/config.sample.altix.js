module.exports = {
    debug: true,
    webport: 4201,
    listenOnHost: "",
    rackSorting: {
        sortAscending: false,
        useCustomSortOrder: false,
        sortOrder: [
            "001c01",
            "001c02",
            "001c03",
            "001c04",
            "001r20"
        ]
    },
    routerStyle: "altix",
    altix350Style: "grey",
    L2: {
        host: "192.168.0.100",
        shellPrompt: "SGI-L2-001-L2>"
    }
}