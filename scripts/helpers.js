moment.locale('es');
//GET DATE AND HOUR
export const dateYHour = () => {
    const dateYHour = `${moment().format("D/M/YYYY")} ${moment().format('h: mm a')}`
    return dateYHour;
}

export const justDate = () => {
    const fecha = moment().format("D/M/YYYY");
    return fecha;
}

export const hour = () => {
    const Hour = moment().format('h: mm a');
    return Hour;
}


//Compare date to render 
export const compareDate = (a) => {
    const timeElapsed = moment(a, "D/M/YYYY").diff(moment(), 'days');
    if (timeElapsed == 0) {
        return 'Hoy'
    } 
    if (timeElapsed == -1) {
        return 'Ayer'
    }
    if (timeElapsed < -1 && timeElapsed > -7) {
        return (moment(a, "D/M/YYYY").format('dddd')).charAt(0).toUpperCase() + moment(a, "D/M/YYYY").format('dddd').substring(1)
    }
    if (timeElapsed < -7) {
        return a 
    }
}
