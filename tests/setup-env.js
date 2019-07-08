import {plugins} from 'pretty-format'
import '../src/extend-expect'

expect.addSnapshotSerializer(plugins.ConvertAnsi)
