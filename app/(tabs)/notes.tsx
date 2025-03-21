import { FontAwesome5 } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Dimensions, Platform, Pressable, Text, View } from 'react-native';
import { Note, useNoteStore } from '../../utils/manageNotes';
import moment from 'moment';
import MasonryList from 'reanimated-masonry-list';
import 'react-native-get-random-values';
import { v4 } from 'uuid';
import { useState } from 'react';

export default function Notes() {
  const { activeNotesArray } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');

  const windowWidth = Dimensions.get('window').width;
  const maxColumnWidth = 400;
  const possibleColumnCount = Math.floor(windowWidth / maxColumnWidth);
  const columnCount: number = possibleColumnCount < 2 ? 2 : possibleColumnCount;

  const newNote = () => {
    const newNoteUUID = v4();
    router.push(`note/${newNoteUUID}`);
  };

  const NewButton = () => (
    <Pressable onPress={() => newNote()}>
      <View className="text-background pl-5 pt-4 pb-5 pr-4 rounded-xl bg-primary">
        <FontAwesome5 name="edit" size={24} />
      </View>
    </Pressable>
  );

  const filteredNotes =
    searchQuery.trim() === ''
      ? activeNotesArray()
      : activeNotesArray().filter((note) => {
          const query = searchQuery.toLowerCase();
          return (
            (note.title && note.title.toLowerCase().includes(query)) ||
            (note.content && note.content.toLowerCase().includes(query))
          );
        });

  return (
    <View className="flex flex-1 flex-col mx-8 mb-2 rounded-xl overflow-hidden">
      <View className="flex flex-row jusify-between items-center">
        <Text className="text-text text-3xl mb-4">Notes</Text>
        {Platform.OS == 'web' && <NewButton />}
      </View>
      <View className="flex-1 rounded-xl overflow-hidden">
        <MasonryList
          data={filteredNotes}
          renderItem={({ item }) => <NoteCard note={item as Note} />}
          numColumns={columnCount}
          ListEmptyComponent={
            <Text className="text-text text-center py-10">No notes</Text>
          }
          keyExtractor={({ item }: { item: Note }): string => item?.uuid}
          style={{ gap: 16 }}
        />
      </View>
      {Platform.OS !== 'web' && (
        <View className="bottom-0 right-0 absolute">
          <NewButton />
        </View>
      )}
    </View>
  );
}

const NoteCard = ({ note }: { note: Note }) => (
  <Pressable onPress={() => router.push(`/note/${note.uuid}`)} key={note.uuid}>
    <View
      className={`bg-secondary-850 p-4 rounded-2xl flex flex-col gap-4 mb-4`}
    >
      {note?.title && <Text className="text-xl text-text">{note.title}</Text>}
      {note?.content && (
        <Text className="text-text max-h-[12rem] overflow-hidden">
          {note?.content?.length > 200
            ? note?.content?.slice(0, 197) + '...'
            : note?.content}
        </Text>
      )}
      <View>
        <Text className="text-text">
          {moment(note?.createdAt).format('DD.MM.YYYY')}
        </Text>
        <Text className="text-accent">
          Last edited {moment(note.updatedAt).fromNow()}
        </Text>
        {note?.endsAt && (
          <Text className="text-primary">
            Due {moment(note.endsAt).fromNow()}
          </Text>
        )}
      </View>
    </View>
  </Pressable>
);
