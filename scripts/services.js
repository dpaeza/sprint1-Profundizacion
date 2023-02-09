// const URL_API_USERS = 'http://localhost:3000/users';
// const URL_API_MESSAGES = 'http://localhost:3000/messages';

const URL_API_USERS = 'https://sprint1miniback-production.up.railway.app/users';
const URL_API_MESSAGES = 'https://sprint1miniback-production.up.railway.app/messages';


//END POINT USERS
export const getApiUsers = async () => {
    try {
        const { data } = await axios.get(URL_API_USERS);
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const postNewUser = async (newUser) => {
    try {
        await axios.post(URL_API_USERS,newUser)
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export const changePropertyUSer = async (id,obj) => {
    try {
        await axios.patch(`${URL_API_USERS}/${id}`,obj)
    } catch (error) {
        console.log(error)
    }
}

//ENDPOINT MESSAGES
export const getApiMessages = async () => {
    try {
        const { data } = await axios.get(URL_API_MESSAGES);
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const changePropertyMessages = async (id,obj) => {
    try {
        await axios.patch(`${URL_API_MESSAGES}/${id}`,obj)
    } catch (error) {
        console.log(error)
    }
}

export const postNewMessages = async (newMessages) => {
    try {
        const {data} = await axios.post(URL_API_MESSAGES,newMessages)
        return data;
    } catch (error) {
        console.log(error)
    }
}

