import {createReadStream, createWriteStream} from 'fs'
import { removeBrakets } from '../utils/utils.mjs'

export const cat = async (currentPath, file) => {
  file = removeBrakets(file);
  const rs = createReadStream(currentPath)
  
}