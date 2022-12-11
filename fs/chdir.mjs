import path from 'path'

export const cdUp = (currentPath) => path.parse(currentPath).dir;