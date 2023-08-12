import {plugins} from 'pretty-format'
import '../src/index'

expect.addSnapshotSerializer(plugins.ConvertAnsi)
