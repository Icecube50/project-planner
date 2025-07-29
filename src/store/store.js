import { reactive } from "vue";
import DummyDb from "./Database_Mockup/dummy_database"; 

const _db = new DummyDb()

export const store = reactive({
    cache: null,
    db: _db,
})