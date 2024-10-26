import React from "react";
import {
  Text,
  TouchableWithoutFeedback,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import FitImage from "react-native-fit-image";
import { Linking } from "react-native";

// the code was taken from react-native-markdown-display (https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js)

function openUrl(url, customCallback) {
  if (customCallback) {
    const result = customCallback(url);
    if (url && result && typeof result === "boolean") {
      Linking.openURL(url);
    }
  } else if (url) {
    Linking.openURL(url);
  }
}

const textStyleProps = [
  "textShadowOffset",
  "color",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "lineHeight",
  "textAlign",
  "textDecorationLine",
  "textShadowColor",
  "fontFamily",
  "textShadowRadius",
  "includeFontPadding",
  "textAlignVertical",
  "fontVariant",
  "letterSpacing",
  "textDecorationColor",
  "textDecorationStyle",
  "textTransform",
  "writingDirection",
];

function hasParents(parents, type) {
  return parents.findIndex((el) => el.type === type) > -1;
}

const markdownRules = {
  // when unknown elements are introduced, so it wont break
  // unknown: (node, children, parent, styles) => null,
  //
  // // The main container
  body: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_body} className="flex flex-1">
      {children}
    </View>
  ),

  // Headings
  heading1: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={styles._VIEW_SAFE_heading3}
      className="!w-full !flex"
    >
      <Text className="pt-5 pb-1 w-full">{children}</Text>
    </View>
  ),
  heading2: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={styles._VIEW_SAFE_heading2}
      className="!w-full !flex"
    >
      <Text className="pt-4 pb-1 w-full">{children}</Text>
    </View>
  ),
  heading3: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading3}>
      <Text className="pt-4 pb-1 w-full ">{children}</Text>
    </View>
  ),
  heading4: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading4}>
      <Text className="pt-3 pb-1 w-full">{children}</Text>
    </View>
  ),
  heading5: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading5}>
      <Text className="pt-2 pb-1 w-full">{children}</Text>
    </View>
  ),
  heading6: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading6}>
      <Text className="pt-1 pb-1 w-full">{children}</Text>
    </View>
  ),

  // Horizontal Rule
  hr: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={{ ...styles._VIEW_SAFE_hr, backgroundColor: "#313749" }}
      className="!h-[2px] !bg-secondary rounded-xl"
    />
  ),

  // Emphasis
  strong: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.strong}>
      {children}
    </Text>
  ),
  em: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.em}>
      {children}
    </Text>
  ),
  s: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.s}>
      {children}
    </Text>
  ),

  // Blockquotes
  blockquote: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={styles._VIEW_SAFE_blockquote}
      className="!border-accent !bg-background w-full"
    >
      {children}
    </View>
  ),

  // Lists
  bullet_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_bullet_list}>
      {children}
    </View>
  ),
  ordered_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_ordered_list}>
      {children}
    </View>
  ),
  // this is a unique and quite annoying render rule because it has
  // child items that can be styled (the list icon and the list content)
  // outside of the AST tree so there are some work arounds in the
  // AST renderer specifically to get the styling right here
  list_item: (node, children, parent, styles, inheritedStyles = {}) => {
    // we need to grab any text specific stuff here that is applied on the list_item style
    // and apply it onto bullet_list_icon. the AST renderer has some workaround code to make
    // the content classes apply correctly to the child AST tree items as well
    // as code that forces the creation of the inheritedStyles object for list_items
    const refStyle = {
      ...inheritedStyles,
      ...StyleSheet.flatten(styles.list_item),
    };

    const arr = Object.keys(refStyle);

    const modifiedInheritedStylesObj = {};

    for (let b = 0; b < arr.length; b++) {
      if (textStyleProps.includes(arr[b])) {
        modifiedInheritedStylesObj[arr[b]] = refStyle[arr[b]];
      }
    }

    if (hasParents(parent, "bullet_list")) {
      return (
        <View key={node.key} style={styles._VIEW_SAFE_list_item}>
          <Text
            style={[modifiedInheritedStylesObj, styles.bullet_list_icon]}
            accessible={false}
            className="!text-text"
          >
            {Platform.select({
              android: "\u2022",
              ios: "\u00B7",
              default: "\u2022",
            })}
          </Text>
          <View style={styles._VIEW_SAFE_bullet_list_content}>{children}</View>
        </View>
      );
    }

    if (hasParents(parent, "ordered_list")) {
      const orderedListIndex = parent.findIndex(
        (el) => el.type === "ordered_list",
      );

      const orderedList = parent[orderedListIndex];
      let listItemNumber;

      if (orderedList.attributes && orderedList.attributes.start) {
        listItemNumber = orderedList.attributes.start + node.index;
      } else {
        listItemNumber = node.index + 1;
      }

      return (
        <View key={node.key} style={styles._VIEW_SAFE_list_item}>
          <Text
            style={[modifiedInheritedStylesObj, styles.ordered_list_icon]}
            className="!text-text"
          >
            {listItemNumber}
            {node.markup}
          </Text>
          <View style={styles._VIEW_SAFE_ordered_list_content}>{children}</View>
        </View>
      );
    }

    // we should not need this, but just in case
    return (
      <View key={node.key} style={styles._VIEW_SAFE_list_item}>
        {children}
      </View>
    );
  },

  // Code
  code_inline: (node, children, parent, styles, inheritedStyles = {}) => (
    <Text
      key={node.key}
      style={[inheritedStyles, styles.code_inline]}
      className="!bg-secondary !p-1 !border-0 !rounded-lg text-text"
    >
      {node.content}
    </Text>
  ),
  code_block: (node, children, parent, styles, inheritedStyles = {}) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;

    if (
      typeof node.content === "string" &&
      node.content.charAt(node.content.length - 1) === "\n"
    ) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <Text
        key={node.key}
        style={[inheritedStyles, styles.code_block]}
        className="!bg-secondary !p-2 !border-0 text-text !rounded-lg"
      >
        {content}
      </Text>
    );
  },
  fence: (node, children, parent, styles, inheritedStyles = {}) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;

    if (
      typeof node.content === "string" &&
      node.content.charAt(node.content.length - 1) === "\n"
    ) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <Text key={node.key} style={[inheritedStyles, styles.fence]}>
        {content}
      </Text>
    );
  },

  // Tables
  table: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={{ ...styles._VIEW_SAFE_table }}
      className="!border-secondary !border-2 !rounded-lg"
    >
      {children}
    </View>
  ),
  thead: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_thead}>
      {children}
    </View>
  ),
  tbody: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_tbody}>
      {children}
    </View>
  ),
  th: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_th}>
      {children}
    </View>
  ),
  tr: (node, children, parent, styles) => (
    <View
      key={node.key}
      style={styles._VIEW_SAFE_tr}
      className="!border-secondary !roundend-lg"
    >
      {children}
    </View>
  ),
  td: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_td}>
      {children}
    </View>
  ),

  // Links
  link: (node, children, parent, styles, onLinkPress) => (
    <Text
      key={node.key}
      style={styles.link}
      onPress={() => openUrl(node.attributes.href, onLinkPress)}
    >
      {children}
    </Text>
  ),
  blocklink: (node, children, parent, styles, onLinkPress) => (
    <TouchableWithoutFeedback
      key={node.key}
      onPress={() => openUrl(node.attributes.href, onLinkPress)}
      style={styles.blocklink}
    >
      <View style={styles.image}>{children}</View>
    </TouchableWithoutFeedback>
  ),

  // Images
  image: (
    node,
    children,
    parent,
    styles,
    allowedImageHandlers,
    defaultImageHandler,
  ) => {
    const { src, alt } = node.attributes;

    // we check that the source starts with at least one of the elements in allowedImageHandlers
    const show =
      allowedImageHandlers.filter((value) => {
        return src.toLowerCase().startsWith(value.toLowerCase());
      }).length > 0;

    if (show === false && defaultImageHandler === null) {
      return null;
    }
    console.log(src);

    const imageProps = {
      indicator: true,
      key: node.key,
      style: { flex: 1 },
      resizeMode: "cover",
      className: "w-80",
      source: {
        uri: show === true ? src : `${defaultImageHandler}${src}`,
      },
    };

    if (alt) {
      imageProps.accessible = true;
      imageProps.accessibilityLabel = alt;
    }

    console.log(imageProps);

    return (
      <View className="flex grow h-80 flex-row" key={node.key}>
        <FitImage {...imageProps} />
      </View>
    );
  },

  // Text Output
  text: (node, children, parent, styles, inheritedStyles = {}) => (
    <Text
      key={node.key}
      style={[inheritedStyles, styles.text]}
      className="text-text text-base w-full"
    >
      {node.content}
    </Text>
  ),
  textgroup: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.textgroup}>
      {children}
    </Text>
  ),
  paragraph: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_paragraph} className="w-full">
      <Text>{children}</Text>
    </View>
  ),
  hardbreak: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.hardbreak}>
      {"\n"}
    </Text>
  ),
  softbreak: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.softbreak}>
      {"\n"}
    </Text>
  ),

  // Believe these are never used but retained for completeness
  pre: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_pre}>
      {children}
    </View>
  ),
  inline: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.inline}>
      {children}
    </Text>
  ),
  span: (node, children, parent, styles) => (
    <Text key={node.key} style={styles.span}>
      {children}
    </Text>
  ),
};

export default markdownRules;