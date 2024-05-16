import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

export default function TabOneScreen() {
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    const scheduledNotifications = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'You have a new notification!',
                body: 'Here is the notification body',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 4 },
        });
    };

    // prompt permission for notifications
    useEffect(() => {
        Notifications.requestPermissionsAsync({
            ios: {
                allowAlert: true,
                allowBadge: true,
                allowDisplayInCarPlay: true,
                allowSound: true,
            },
        }).then((status) => console.log(status));

        notificationListener.current =
            Notifications.addNotificationReceivedListener(async (n) => {
                console.log('notification received', n);
                const badgeCount = await Notifications.getBadgeCountAsync();
                console.log('notifications count:', badgeCount);
                await Notifications.setBadgeCountAsync(badgeCount + 1);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(async (n) => {
                console.log('notification response', n);
                alert(n.notification.request.content.data.data);
                await Notifications.dismissAllNotificationsAsync();
                await Notifications.setBadgeCountAsync(0);
            });

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current!,
            );
            Notifications.removeNotificationSubscription(
                responseListener.current!,
            );
        };
    }, []);
    return (
        <View style={styles.container}>
            <Button title='Schedule' onPress={scheduledNotifications} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
