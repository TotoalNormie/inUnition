import { Pressable, Text, useColorScheme, View } from "react-native";
import { TabRouter } from "@react-navigation/native";
import { Navigator, usePathname, Slot } from "expo-router";
import NavLink from "../../components/NavLink";
import { Feather, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import DarkLogoFull from "../../assets/darkLogoFull.svg";
import { useAuth } from "../../components/auth/authContext";

export default function WebLayout() {
  return (
    <View className="bg-background color-text p-2 min-h-full">
      <Navigator router={TabRouter}>
        <View className="flex flex-row gap-2 color-current h-full">
          <Header />
          <View className="flex-1 rounded-lg p-2 bg-background-100">
            <Slot />
          </View>
        </View>
      </Navigator>
    </View>
  );
}

const Header = () => {
  const { navigation, state, descriptors, router } = Navigator.useContext();
  const theme = useColorScheme();
  const { user, isLoadingUser } = useAuth();

  const pathname = usePathname();

  return (
    <View className="flex align-middle justify-between px-4 py-2 rounded-lg bg-background-100">
      <View className="flex flex-col gap-2">
        <View className="flex flex-row justify-between">

          <DarkLogoFull width={"100%"} className="text-3xl" />
          <Pressable className="flex justify-end">
            <MaterialIcons name="keyboard-arrow-right" size={24} className="color-text" />
          </Pressable>
        </View>
        <Hr />
        <NavLink href="/" icon={<Ionicons name="home" size={24} />}>Home</NavLink>
        <NavLink href="/notes" icon={<Ionicons name="document-text" size={24} />}>New Note</NavLink>
        <NavLink href="/tasks" icon={<Octicons name="tasklist" size={24} />}>Task Manegment</NavLink>
        <Hr />
      </View>
      <View >
        {!user && <NavLink href="./user" icon={<Feather name="user" size={24} />}>{user?.name}</NavLink>}
      </View>

    </View>
  );
}

const Hr = () => {
  return <View className="w-full h-[2px] bg-background-200" />
}