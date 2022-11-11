export function firebaseNotificationRedirection(screen) {
    if(screen === "orders") {
        props.navigation.navigate("MyOrders");
    }
}