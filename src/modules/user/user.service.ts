import initUser from "../../database/models/user";

export const getUsers = async () => {

    let data;
    try {
        data = await initUser.find();
    } catch(e) {
        // tslint:disable-next-line:no-console
        console.log('[Error getUser]:', e);
    }

    return data;
}

export const claimToken = async () => {

    let data;
    try {
        data = await initUser.find();
    } catch(e) {
        // tslint:disable-next-line:no-console
        console.log('[Error getUser]:', e);
    }

    return data;
}