export const parseArgs = () => {
    for(let val of process.argv ){
        if(val.slice(0, 2) === '--') {
            const arg = val.slice(2).split('=')
            if(arg[0] === 'username') {
                return { username: arg[1] };
            }
        }
    };
    return { username: 'guest' };
};