import { FlatList, Pressable, Text, View } from "react-native";
import { getAllNotes, Note, NoteWithUUID } from "../../utils/manageNotes";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

export default Home = () => {
  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      return await getAllNotes();
    },
  });
  const currentTimestamp = new Date();

  const relevantNotes: NoteWithUUID[] =
    notes &&
    Object.entries(notes)
      .map(([uuid, note]) => ({ ...note, uuid }))
      .filter(
        (note) =>
          !note?.ends_at || (note?.ends_at && moment(note.ends_at).isAfter()),
      )
      .sort((a, b) => {
        const aEndsAt = a.ends_at ? moment(a.ends_at) : null;
        const bEndsAt = b.ends_at ? moment(b.ends_at) : null;

        if (aEndsAt && bEndsAt) {
          if (aEndsAt.isAfter() && bEndsAt.isAfter()) {
            return aEndsAt.valueOf() - bEndsAt.valueOf();
          }
        }

        if (aEndsAt && aEndsAt.isAfter()) return -1;
        if (bEndsAt && bEndsAt.isAfter()) return 1;

        return moment(b.updated_at).valueOf() - moment(a.updated_at).valueOf();
      });
  console.log(relevantNotes);
  return (
    <View className="flex flex-col gap-10 flex-1">
      <View className="flex flex-col gap-8 ">
        <Text className="text-3xl text-text">Relevant Notes</Text>
        <View className="flex ">
          {notes ? (
            <View className="rounded-xl overflow-hidden">
              <FlatList
                data={relevantNotes}
                horizontal
                className="rounded-2xl"
                renderItem={({ item: note }) => (
                  <Pressable
                    onPress={() => router.push(`/note/${note.uuid}`)}
                    key={note.uuid}
                    className={`bg-secondary-850 ${note?.ends_at ? "border-2 border-primary" : ""} p-4 rounded-2xl w-60 flex flex-col gap-2 ml-2`}
                  >
                    <View className="flex flex-row gap-2">
                      <Text className="text-xl text-text flex-1">
                        {note?.title?.length > 30
                          ? note?.title?.substr(0, 27) + "..."
                          : note?.title}
                      </Text>
                      <Text className="color-text ">
                        <FontAwesome5 name="edit" size={24} />
                      </Text>
                    </View>
                    <Text className="text-text ">
                      {note?.content?.length > 100
                        ? note?.content?.substr(0, 97) + "..."
                        : note?.content}
                    </Text>
                    <View className="mt-auto">
                      {note?.ends_at ? (
                        <Text className="text-primary">
                          Due {moment(note.ends_at).fromNow()}
                        </Text>
                      ) : (
                        <Text className="text-accent">
                          Last edited {moment(note.updated_at).toNow()}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                )}
              />
            </View>
          ) : (
            <View>
              <Link className="color-text" href="/notes/new">
                No notes, create one
              </Link>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
