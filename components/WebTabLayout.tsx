import { Link, Navigator, Slot, usePathname } from 'expo-router';
import { Pressable, useColorScheme, View } from 'react-native';
import DarkLogoFull from '../assets/darkLogoFull.svg';
import { TabRouter } from '@react-navigation/native';
import NavLink from './NavLink';
import { Feather, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { useAuthStore } from '../utils/useAuthStore';

export default function WebTabLayout() {
  return (
    <Navigator router={TabRouter}>
      <View className="flex p-4 bg-background flex-row gap-4 color-current h-full">
        <Sidebar />
        <View className="flex-1 rounded-lg p-4 grow specific-issue">
          <Slot />
        </View>
      </View>
    </Navigator>
  );
}

const Sidebar = () => {
  const theme = useColorScheme();
  const { isLoading, user } = useAuthStore();
  const pathname = usePathname();

  return (
    <View className="flex h-full overflow-scroll align-middle justify-between p-4 rounded-xl bg-secondary-850">
      <View className="flex flex-col gap-2">
        <View className="flex flex-row justify-between">
          <DarkLogoFull width={'100%'} className="text-3xl" />
          <Pressable className="flex justify-end">
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              className="color-text"
            />
          </Pressable>
        </View>
        <Hr />
        <NavLink href="/" icon={<Ionicons name="home" size={24} />}>
          Home
        </NavLink>
        <NavLink
          href="/notes"
          icon={<Ionicons name="document-text" size={24} />}
        >
          Your Notes
        </NavLink>
        <NavLink href="/tasks" icon={<Octicons name="tasklist" size={24} />}>
          Task Manegment
        </NavLink>
        <Hr />
      </View>
      <View>
        {user && (
          <>
            <NavLink href="/user" icon={<Feather name="user" size={24} />}>
              {user?.displayName}
            </NavLink>
            <Link href="/logout" className="color-text flex-1">
              Log out{' '}
            </Link>
          </>
        )}
        {!isLoading && !user && (
          <Link href="/login" className="color-text flex-1">
            Log in
          </Link>
        )}
      </View>
    </View>
  );
};

const Hr = () => <View className="w-full h-[2px] bg-" />;
