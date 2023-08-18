# Navigation

The mobile application's navigation is based on the [react-navigation](https://reactnavigation.org/) library. The diagram below shows the navigation structure of the application.

```
    					            NIMI
-DrawerNav				            -
..-RootStack				        'RootStack'	
....-BottomNav				        'BottomNavigation'
......+GraphScreen(TopNav)		    'Grafiikka'
......+ShotScreen(TopNav)		    'Kaadot'
......-MaintenanceScreen(TopNav)	'Ylläpito'
........MemberScreen		        'Jäsen'
........GroupScreen			        'Ryhmä'
........CompanyScreen		        'Seurue'
......DetailsScreen			        'Details'
......AddScreen				        'Add'
..ProfileScreen				        'Profile'
..ResetPasswordScreen		        'NewPassWord'

```

## Navigation structure

The first level navigation is a drawer navigation. It is defined first to allow the drawer to be used in all screens. The drawer navigation contains the root stack, which is a stack navigation that allows laying screens on top of each other.

The root stack contains the bottom navigation, which is a tab navigation. It also contains details and add screens which pops up on top of the bottom navigation when the user wants to add or view details of a shot, member etc.

The bottom navigation contains the graph, shot and maintenance screens. These screens are also top navigation screens to allow navigation between the different screens.
