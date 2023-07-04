import { useState } from 'react';
import { Text, BottomNavigation } from "react-native-paper"

const ChartRoute = () => <Text>Yhteenvetosivu</Text>

const ShotRoute = () => <Text>Kaatosivu</Text>

const ShareRoute = () => <Text>Jakosivu</Text>

const ManagementRoute = () => <Text>Ylläpitosivu</Text>


const BottomNav = () => {
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'summary', title: 'Yhteenveto', focusedIcon: 'chart-box' },
        { key: 'shots', title: 'Kaadot', focusedIcon: 'crosshairs' },
        { key: 'share', title: 'Jako', focusedIcon: 'share-circle' },
        { key: 'management', title: 'Ylläpito', focusedIcon: 'account-supervisor-circle' },
    ])

    const renderScene = BottomNavigation.SceneMap({
        summary: ChartRoute,
        shots: ShotRoute,
        share: ShareRoute,
        management: ManagementRoute,
    })

    return (
        <>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </>
    )
}

export default BottomNav