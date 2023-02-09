//IMPORTS 
import { getApiUsers, getApiMessages, changePropertyUSer} from "./scripts/services.js";
import { actionsFormSigIn, signUpEvent, redirectionToSignUp, renderHomePage, formImgProfile, inputImgProfile, idUserOnline} from './scripts/ui.js';
import { dateYHour} from './scripts/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    const usersData = await getApiUsers();
    const messagesData = await getApiMessages();
    actionsFormSigIn(usersData, messagesData);
    redirectionToSignUp();
    signUpEvent(usersData);
    cleanFlagUsers(usersData);
    renderHomePage(usersData, messagesData);
});

const cleanFlagUsers = (usersData) => {
    usersData.forEach(async element => {
        await changePropertyUSer(element.id, { flag: true })
    });
};

//Input for change profile picture
formImgProfile.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (inputImgProfile.value) {
        await changePropertyUSer(idUserOnline, { url_profile_image: inputImgProfile.value });
        const usersData = await getApiUsers();
        const messagesData = await getApiMessages();
        renderHomePage(usersData, messagesData);
        formImgProfile.reset();
    }
});

//FLAG TO KNOW IF USER IT's ONLINE
    document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
        if (!homePage.classList.contains('hidden')) {
            console.log('The page is visible.')
            await changePropertyUSer(idUserOnline, { flag: false })
            const usersData = await getApiUsers();
            const messagesData = await getApiMessages();
            renderHomePage(usersData, messagesData);
            }
        } else {
        if (!homePage.classList.contains('hidden')) {
            changePropertyUSer(idUserOnline, { flag: true })
            console.log('The page is hidden.')
            await changePropertyUSer(idUserOnline, { last_on_line: dateYHour()});
            const usersData = await getApiUsers();
            const messagesData = await getApiMessages();
            renderHomePage(usersData, messagesData);
        }
        }
    });


