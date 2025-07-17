const ICON_MAP = {
    addToCart: "add-to-cart.svg",
    shoppingBag: "shopping-bag.svg",
    checkIcon: "check.svg",
    successIcon: "success.svg",
    clockIcon: "clock.svg",
    closeIcon: "close.svg",
    deleteIcon: "delete.svg",
    detailsIcon: "details.svg",
    downArrow: "down-arrow.svg",
    leftArrow: "left-arrow.svg",
    emailIcon: "email.svg",
    locationIcon: "location.svg",
    minusIcon: "minus.svg",
    plusIcon: "plus.svg",
    phoneIcon: "phone.svg",
    pepperIcon: "pepper.svg",
    shareIcon: "share.svg",
    userIcon: "user.svg",
}

export function getIcon(iconId) {
    const iconPath = ICON_MAP[iconId];
    if (!iconPath) {
        throw new Error(`Icona con ID "${iconId}" non trovata.`);
    }

    return `/icons/${iconPath}`;
}