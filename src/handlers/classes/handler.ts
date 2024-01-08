import { auth } from '@/lib/auth'
import { buildRouter, buildHandler } from '@/lib/router'
import { createClass } from './createClass'
import { getClass } from './getClass'
import { updateClass } from './updateClass'
import { listClasses } from './listClasses'
import { removeClass } from './deleteClass'
import { updateClassProgress } from './updateClassProgress'
import { listClassesIndicators } from './listClassesIndicators'
import { listUserClasses } from './listUserClasses'

const router = buildRouter()

router.post('/classes', auth.verifyLogged(createClass))
router.get('/classes/{classId}', auth.verifyLogged(getClass))
router.get('/classes/mine', auth.verifyLogged(listUserClasses))
router.post('/classes/{classId}/mine', auth.verifyLogged(updateClassProgress))
router.put('/classes', auth.verifyLogged(updateClass))
router.get('/classes', auth.verifyLogged(listClasses))
router.get('/classes/indicators', auth.verifyLogged(listClassesIndicators))
router.delete('/classes/{classId}', auth.verifyLogged(removeClass))

const main = buildHandler(router)

export {
  main
}
