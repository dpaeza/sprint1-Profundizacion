//IMPORTS
import { postNewUser, changePropertyUSer, changePropertyMessages, getApiUsers, getApiMessages, postNewMessages} from "./services.js";
import { justDate, hour, compareDate} from "./helpers.js";

//FORM SIGN IN DOM ELEMENTS
const formSignInContainer = document.getElementById('formSignInContainer');
const formSignIn = document.getElementById("formSignIn");
const logInNumber = document.getElementById("logInNumber");
const logInPassword = document.getElementById("logInPassword");
const signUpFree = document.getElementById("signUpFree");

//FORM SIGN UP DOM ELEMENTS
const formSignUp = document.getElementById("formSignUp");
const signUpNumber = document.getElementById("signUpNumber");
const signUpName = document.getElementById("signUpName");
const signUpPassword = document.getElementById("signUpPassword");
const signUpImg = document.getElementById("signUpImg");
const signUpPhrase = document.getElementById("signUpPhrase");
const formSignUpContainer = document.getElementById('formSignUpContainer');

//HOMEPAGE DOM ELEMENTS
const homePage = document.getElementById('homePage');
const imgProfileMini = document.getElementById('imgProfileMini');
const leftSide = document.getElementById('leftSide');
const leftSide_Chats = document.getElementById('leftSide_Chats');
const leftSide_EditProfile = document.getElementById('leftSide_EditProfile');
const arrorLeft = document.getElementById('arrorLeft');
const searchInConversation = document.getElementById('searchInConversation');
const fixedBarSearch = document.getElementById('fixedBarSearch');
const XfixedBarSearch = document.getElementById('XfixedBarSearch');
const imgProfileUser = document.getElementById('imgProfileUser');
const imgProfileUserBig = document.getElementById('imgProfileUserBig');
const nameUser = document.getElementById('nameUser');
const editUserName = document.getElementById('editUserName');
const chatsBar = document.getElementById('chatsBar');
export const inputImgProfile = document.getElementById('inputImgProfile');
export const formImgProfile = document.getElementById('formImgProfile');

const inputFilterMiniChats = document.getElementById('inputFilterMiniChats');

//BIG CHAT - HOMEPAGE DOM ELEMENTS
const rightSide = document.getElementById('rightSide');
const nameBigChat = document.getElementById('nameBigChat');
const otherUserImgProfile = document.getElementById('otherUserImgProfile');
const statusOtherUser = document.getElementById('statusOtherUser');
const mainChat = document.getElementById('mainChat');
const formSendMsg = document.getElementById('formSendMsg');
const inputFormSendNsg = document.getElementById('inputFormSendNsg');
const micAndSend = document.getElementById('micAndSend');
const arrowHeaderMain = document.getElementById('arrowHeaderMain');

//SEARCH BAR FIXED ON BIG CHAT - DOM ELEMENTS
const inputFilterBigChat = document.getElementById('inputFilterBigChat');
const searchResultContainer = document.getElementById('searchResultContainer');
const name = document.getElementById('name');

const formInputFilterMiniChats = document.getElementById("formInputFilterMiniChats")

//
export let idUserOnline = 0;
export let idOther = 0;
export let idMs = 0;
let messageUserAll = [];
let loque = 0;
let pMsgBefore = '';
let lastDateCompared;
let newChat, idNewUser ;
// let idMessages = 0;





const sweetAlert = (text,icon='') => {
    return Swal.fire({
        title: `${text}`,
        confirmButtonColor: "#34b7f1",
        icon,
    });
};

const sweetAlertWelcome = (userName) => {
    return Swal.fire({
        position: "center",
        icon: "success",
        title: userName,
        showConfirmButton: false,
        timer: 1500,
    });
};


// SIGN IN EVENT
export const actionsFormSigIn = (usersData, messagesData) => {
    formSignIn.addEventListener("submit", (e) => {
        e.preventDefault();
        signInValidation(usersData, messagesData);
    });
}

//VALIDATE
const validateInputLogin = () => {
    if(!logInNumber.value && !logInPassword.value) {
        sweetAlert("Es necesario diligenciar los campos");
        return false
    }
    if (!logInNumber.value) {
        sweetAlert("Es necesario diligenciar número de celular");
        return  false
    }
    if (!logInPassword.value) {
        sweetAlert("Es necesario diligenciar la contraseña");
        return false
    }
    return true
}

//SIGN IN FORM VALIDATION
const signInValidation = (usersData, messagesData) => {
    const isValidate = validateInputLogin();
    if(!isValidate) return
    let x = false;
    if (logInNumber.value && logInPassword.value) {
        const logInNumberPars = parseInt(logInNumber.value);
        usersData.forEach( async (user) => {
            if (logInNumberPars === user.cellphone) {
                x = true;
                if(logInPassword.value == user.password){
                    sweetAlertWelcome(`Bienvenido usuario ${user.name}`);
                    idUserOnline = user.id;
                    homePage.classList.remove('hidden');
                    formSignInContainer.classList.add('hidden');
                    await changePropertyUSer(idUserOnline, { flag: false });
                    renderHomePage(usersData, messagesData);
                    getMessageUserAll(usersData, messagesData);
                    loque = messageUserAll[0].idMessages;
                    actCheckView();
                    renderBigChat();
                    return
                }
                return sweetAlert("La contraseña ingresada es incorrecta");
            }
        });
        if (!x) {
            sweetAlert("El número ingresado no existe");
        }
    }
};


//REDIRECTION TO SIGNUP FORM
export const redirectionToSignUp = () => {
    signUpFree.addEventListener("click", () => {
    formSignInContainer.classList.add('hidden');
    formSignUpContainer.classList.remove('hidden');
});
}

// SIGNUP FORM
export const signUpEvent = (usersData) => {
    formSignUp.addEventListener("submit", async (e) => {
        e.preventDefault();
        const signUpNumberPars = parseInt(signUpNumber.value);
        let y = true;
        const isNotValidate = usersData.some((user) => signUpNumberPars === user.cellphone);
        if(isNotValidate) return sweetAlert("El número de celular ingresado ya se encuentra registrado");
        if (
            signUpName.value &&
            signUpNumber.value &&
            signUpPassword.value &&
            signUpImg.value &&
            signUpPhrase.value
        ) {
            try{
                const newUser = {
                name: signUpName.value,
                cellphone: parseInt(signUpNumber.value),
                password: signUpPassword.value,
                url_profile_image: signUpImg.value,
                flag: false,
                phrase: signUpPhrase.value,
                last_on_line: "",
                };
                await postNewUser(newUser);
                sweetAlertWelcome("Nuevo usuario creado exitosamente", 'success').then(()=>{
                    window.location.reload()
                });
            } catch(e){
                sweetAlert('Ha ocurrido un error, por favor intetelo mas tarde', 'error')
            }
        } else {
            sweetAlert("Todos los campos deben ser diligenciados");
        }
    });
};

//HOME PAGE

//ACTIVE/DESACTIVE EVENTS
imgProfileMini.addEventListener('click', () => {
    leftSide_Chats.classList.add('hidden');
    leftSide_EditProfile.classList.remove('hidden');
});

arrorLeft.addEventListener('click', () => {
    leftSide_Chats.classList.remove('hidden');
    leftSide_EditProfile.classList.add('hidden');
});

searchInConversation.addEventListener('click', () => {
    fixedBarSearch.classList.remove('hidden');
    searchResultContainer.innerHTML = '';
});

XfixedBarSearch.addEventListener('click', () => {
    fixedBarSearch.classList.add('hidden');
    inputFilterBigChat.value = '';
});



//Render Big Chat
const renderBigChat = async () => {
    mainChat.innerHTML = '';
    messageUserAll.forEach(part => {
        if (part.idMessages == loque) {
            nameBigChat.innerText = part.name;
            name.innerText = part.name;
            otherUserImgProfile.src = part.url_profile_image;
            part.flagUser ? statusOtherUser.innerText = part.last_on_line : statusOtherUser.innerText = 'EN LINEA';
            part.message.forEach(msg => {
                const source = msg.flag ? '../icons/doubleCheckBlue.jpg' : '../icons/doubleCheckGrey.jpg';
                if (msg.date != lastDateCompared) {
                    mainChat.innerHTML += `<span class="día">${compareDate(msg.date)}</span>`;
                    lastDateCompared = msg.date;
                }

                if (msg.sendBy != idUserOnline) {
                    mainChat.innerHTML += `
                    <div class="messageReceived">
                        <div>
                            <p class="fakeInput">${msg.message}</p>
                            <p class="space">n</p>
                        </div>
                        <span>${msg.hour}</span>
                    </div> `;
                } else {
                    mainChat.innerHTML += `
                    <div class="messageSendedContainer">
                        <ul class="desplegMenu hidden" id="desplegMenu">
                            <li id="edit" >Editar</li>
                            <li id="delete" >Eliminar</li>
                        </ul>
                        <div class="messageSended">
                            <div class="mm">
                                <p class="fakeInput" id="pMsg">${msg.message}</p>
                                <figure class="arrow"><img src="./icons/icon-arrow-down.svg" alt="" class="arrow2"></figure>
                            </div>
                            <div class="divHyC">
                                <span id="hourSend">${msg.hour}</span>
                                <i class="checkIconBlue" ><img src="${source}" alt="checkIcon" class="imgIconCheck" ></i>
                            </div>
                        </div>
                    </div>`;
                };
            });
        };
    });
    if (newChat) {
        const usersData2 = await getApiUsers();
        usersData2.forEach(user => {
            if (user.id == idNewUser) {
                mainChat.innerHTML = '';
                nameBigChat.innerText = user.name;
                name.innerText = user.name;
                otherUserImgProfile.src = user.url_profile_image;
                user.flag ? statusOtherUser.innerText = user.last_on_line : statusOtherUser.innerText = 'EN LINEA';
            }
        })
    }
    mainChat.scrollTop = mainChat.scrollHeight;
};

const patchMessages = async (actMessageObject) => {
    await changePropertyMessages(loque, actMessageObject);
}

mainChat.addEventListener('click', async (e) => {
    if (e.target.classList.contains('arrow2')) {
        const parentElement = e.target.closest('.messageSendedContainer');
        const desplegMenu = parentElement.querySelector('#desplegMenu');
        desplegMenu.classList.toggle('hidden');
        const editMsg = parentElement.querySelector('#edit');
        const deletetMsg = parentElement.querySelector('#delete');
        const pMsg = parentElement.querySelector('#pMsg');
        const hourSend = parentElement.querySelector('#hourSend');

        editMsg.addEventListener('click', () => {
            desplegMenu.classList.add('hidden');
            pMsg.toggleAttribute('ContentEditable');
            pMsg.style.cssText = `padding: 0px 5px;`;
            pMsg.focus();
            pMsgBefore = pMsg.textContent;

        });
        pMsg.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                messageUserAll.forEach( ms => {
                    if (ms.idMessages == loque) {
                        const objetoAEditar = ms.message.find(obj => obj.message === pMsgBefore && obj.hour === hourSend.textContent);
                        objetoAEditar.message = pMsg.textContent.trim();
                        ms.message.splice(ms.message.indexOf(objetoAEditar), 1, objetoAEditar);
                        patchMessages({ conversations: ms.message });
                    };
                });
                pMsg.innerText = pMsg.textContent.trim();
                pMsg.removeAttribute('ContentEditable');
            };
        });
        deletetMsg.addEventListener('click', () => {
            desplegMenu.classList.add('hidden');
            const sweetAlertDelete = () => {
                Swal.fire({
                    title: '¿Está seguro de eliminar el mensaje',
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                        'Eliminado',
                        'Tu mensaje ha sido eliminado.',
                        'success'
                        )
                        messageUserAll.forEach( async ms => {
                            if (ms.idMessages == loque) {
                                ms.message.splice(ms.message.findIndex(obj => obj.message === pMsgBefore && obj.hour === hourSend.textContent), 1);
                                patchMessages({ conversations: ms.message });
                                const usersData2 = await getApiUsers();
                                const messagesData2 = await getApiMessages();
                                getMessageUserAll(usersData2, messagesData2);
                                renderBigChat();
                            };
                        });
                    } else {
                        console.log('conservar')
                    }
                })
            }
            sweetAlertDelete();
        });
    };
});

formSendMsg.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (inputFormSendNsg.value) {
        if (!newChat) {
            const messagesData = await getApiMessages();
            const nweMsg = {
                sendBy: idUserOnline,
                date: justDate(),
                hour: hour(),
                message: inputFormSendNsg.value,
                flag: false
            };
            messagesData.forEach(element => {
                if (element.id == loque) {
                    element.conversations.push(nweMsg)
                    const actMessageObject = element;
                    patchMessages(actMessageObject);
                }
            });
            formSendMsg.reset();
            const usersData2 = await getApiUsers();
            const messagesData2 = await getApiMessages();
            getMessageUserAll(usersData2, messagesData2);
            micAndSend.src = '../icons/mic.svg';
            renderBigChat();
        }
        if (newChat) {
            const newChatPost = {
                idUser1: idUserOnline,
                idUser2: parseInt(idNewUser),
                conversations: [
                    {
                    sendBy: idUserOnline,
                    date: justDate(),
                    hour: hour(),
                    message: inputFormSendNsg.value,
                    flag: false
                    }
                ]
            }
            const newConversation = await postNewMessages(newChatPost);
            loque = newConversation.id;
            formSendMsg.reset();
            formInputFilterMiniChats.reset();
            // newChat = false;
            const usersData2 = await getApiUsers();
            const messagesData2 = await getApiMessages();
            getMessageUserAll(usersData2, messagesData2);
            micAndSend.src = '../icons/mic.svg';
            newChat = false;
            renderBigChat();
        }
    }
});

formSendMsg.addEventListener('keyup', () => {
    if (inputFormSendNsg.value) {
        micAndSend.src = '../icons/send.svg';
    } else {
        micAndSend.src = '../icons/mic.svg';
    }
})

//RENDER IMG AND PROFILE NAME
export const renderHomePage = (usersData) => {
    usersData.forEach((user) => {
        if (user.id == idUserOnline) {
            imgProfileUser.src = user.url_profile_image;
            imgProfileUserBig.style.cssText = `background-image: url(${user.url_profile_image});`;
            nameUser.innerText = user.name;
        }
    });
};

//Render mini chats
const renderMiniChats = async (filterChatsValue = '') => {
    chatsBar.innerHTML = '';
    const usersData2 = await getApiUsers();
    const filter = messageUserAll.filter(obj => {
        const name = obj.name.toLowerCase();
        const message = obj.message.some(m => m.message.toLowerCase().includes(filterChatsValue.toLowerCase()));
        return name.includes(filterChatsValue.toLowerCase()) || message;
    })
    const usersDataFilter = usersData2.filter(u => u.name.toLowerCase().includes(filterChatsValue.toLowerCase()));
    const result = filter.concat(usersDataFilter);
    const chats = filterChatsValue ? result : messageUserAll;
    let ids = [];
    chats.forEach((chat , index) => {
        const hasNameProperty = chats[index].hasOwnProperty('message');
        if (hasNameProperty) {
            const length = chat.message.length;
            const position = length - 1;
            let dateMiniChat;
            if (compareDate(chat.message[position].date) === 'Hoy') {
                dateMiniChat = chat.message[position].hour
            } else {
                dateMiniChat = compareDate(chat.message[position].date)
            }
            chatsBar.innerHTML += `
            <div class="chatMiniBar ${chat.idMessages}" id=${chat.idOtherUser}>
                <img src="${chat.url_profile_image}" alt="user profile img" class="profilePhotoChatBar">
                <div class="chat">
                    <div class="fechaYhora">
                        <p class="nameMiniChat">${chat.name}</p>
                        <p class="dayMiniChat">${dateMiniChat}</p>
                    </div>
                    <div class="checkYp">
                        <div class="checkIcons">
                            <img src="../icons/doubleCheckGrey.jpg" alt="check icon">
                        </div>
                        <p>${chat.message[position].message}</p>
                    </div>
                </div>
            </div>
            <hr>`;
            ids.push(chat.idOtherUser)
        }
        if (!hasNameProperty && !ids.includes(chat.id)) {
        chatsBar.innerHTML += `
        <div class="chatMiniBar" id=${chat.id}>
            <img src="${chat.url_profile_image}" alt="user profile img" class="profilePhotoChatBar">
            <div class="chat">
                <div class="fechaYhora">
                    <p class="nameMiniChat">${chat.name}</p>
                </div>
                <div class="checkYp">
                    <p>${chat.phrase}</p>
                </div>
            </div>
        </div>`;
        }
    });
};

//RELLENA messageUserAll con la info de todos los usurios con lo que el usuario en linea tiene conversaciones.
const getMessageUserAll = (usersData, messagesData) => {
    messageUserAll = [];
    let otherUser = 0;
    messagesData.forEach((message) => {

        const objects = {
            idOtherUser: '',
            name: '',
            flagUser: '',
            last_on_line: '',
            url_profile_image: '',
            idMessages: '',
            message: '',
            date: '',
            flag: ''
        };

        //Identify id of other user for each coversation
        switch (idUserOnline) {
            case message.idUser1:
                otherUser = message.idUser2;
                break;
            case message.idUser2:
                otherUser = message.idUser1
                break;
        }

        objects.idOtherUser = otherUser;

        usersData.forEach((user) => {
            if (user.id == otherUser) {
                objects.name = user.name;
                objects.url_profile_image = user.url_profile_image;
                objects.flagUser = user.flag;
                objects.last_on_line = user.last_on_line;
            };
        });

        if (idUserOnline === message.idUser1 || idUserOnline === message.idUser2) {
            objects.message = message.conversations;
            objects.idMessages = message.id;
            messageUserAll.push(objects);
        };
    });
    renderMiniChats();
};

const renderMsgSearchBigChat = (filterChatValue) => {
    searchResultContainer.innerHTML = '';
    messageUserAll.forEach(element => {
        if (element.idMessages == loque && filterChatValue) {
            const filterBigChat = element.message.filter(obj => obj.message.toLowerCase().includes(filterChatValue.toLowerCase()));
            filterBigChat.forEach(msg => {
                searchResultContainer.innerHTML += `
                <div class="searchResult">
                    <span>${ compareDate(msg.date) }</span>
                    <div class="div">
                        <div class="checkIcons">
                            <img src="../icons/doubleCheckGrey.jpg" alt="check icon">
                        </div>
                        <p>${msg.message}</p>
                    </div>
                </div>`
            });
        };
    });
    if (newChat) {
        searchResultContainer.innerHTML = '';
    }
};

//SEARCH EVENT MINI CONVERSATIONS
formInputFilterMiniChats.addEventListener('submit', (e) => {
    e.preventDefault();
    const filterChatsValue = inputFilterMiniChats.value;
    renderMiniChats(filterChatsValue);
});

//SEARCH EVENT ON BIG CHAT
inputFilterBigChat.addEventListener('keyup', () => {
    const filterChatValue = inputFilterBigChat.value;
    renderMsgSearchBigChat(filterChatValue);
});

const actCheckView = () => {
    let t = false;
    messageUserAll.forEach( async element => {
        if (element.idMessages == loque) {
            element.message.forEach((obj,index) => {
                if (!obj.flag && obj.sendBy !== idUserOnline) {
                    const newObj = Object.assign({}, obj, { flag: true });
                    element.message.splice(index, 1, newObj);
                    t = true;
                }
            })
            if (t) {
                patchMessages({ conversations: element.message });
                const usersData2 = await getApiUsers();
                const messagesData2 = await getApiMessages();
                getMessageUserAll(usersData2, messagesData2);
                renderBigChat();
            }
        }
    })
}



//CLICK EVENT ON MINI CHAT
chatsBar.addEventListener('click', (e) => {
    if (e.target.classList.contains('chatMiniBar')) {
        let check = true;
        mainChat.innerHTML = '';
        messageUserAll.forEach((element) => {
            if (element.idOtherUser == e.target.id) {
                loque = element.idMessages;
                idOther = element.idOtherUser;
                renderBigChat();
                actCheckView();
                check = false;
                newChat = false;
            };
        });
        if (check) {
            idNewUser = e.target.id;
            newChat = true;
            renderBigChat();
        }
        if (window.innerWidth < 600) {
            rightSide.classList.remove('ocultar');
            leftSide.classList.add('hidden');
        }
    };
});

//Click event on left arrow on aside right
arrowHeaderMain.addEventListener('click', () => {
    rightSide.classList.add('ocultar');
    leftSide.classList.remove('hidden');
})

export const idOtherUser = (idOtherUSer) => {
    return idOtherUSer
};

//Activ input for edit User Name
editUserName.addEventListener('click', () => {
    nameUser.toggleAttribute('ContentEditable');
    nameUser.focus();
})

//Input for change User Name
nameUser.addEventListener('keyup', async (e) => {
    if (e.key === 'Enter') {
        nameUser.innerText = nameUser.textContent.trim();
        nameUser.removeAttribute('ContentEditable');
        await changePropertyUSer(idUserOnline, { name: nameUser.textContent });
    }
});