import { reactive } from "vue";
import DummyDb from "./Database_Mockup/dummy_database"; 

const _db = new DummyDb()
const _callbacks = []
let _cache = null

export const store = reactive({
    db: _db,
    init: () => {
        if(_cache === null)
            _cache = _db.GetChartData()
    },
    notifyMe: (callback) => {
        _callbacks.push(callback)
    },
    updateCache: () => {
        _cache = _db.GetChartData()

        for(let callback of _callbacks)
            callback()
    },
    getCache: () => { return _cache }
})