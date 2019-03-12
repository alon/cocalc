import * as React from "react";
import memoizeOne from "memoize-one";
import * as immutable from "immutable";
import { MentionsInput, Mention } from "react-mentions";

import { cmp_Date } from "smc-util/misc2";
const { Space } = require("../r_misc");
const { Avatar } = require("../other-users");
const { IS_MOBILE, isMobile } = require("../feature");

const USER_MENTION_MARKUP =
  '<span class="user-mention" account-id=__id__ >@__display__</span>';

interface Props {
  input: string;
  input_ref: any;
  input_style?: any; // Used to override defaults
  enable_mentions: boolean;
  project_users: any;
  user_store: any;
  font_size: number;
  on_paste?: (e) => void;
  on_change: (value, mentions) => void;
  on_send: (value) => void;
  on_clear: () => void;
  on_set_to_last_input: () => void;
  account_id: string;
}

export class ChatInput extends React.PureComponent<Props> {
  static defaultProps = {
    enable_mentions: true,
    font_size: 14
  };

  input_style = memoizeOne(font_size => {
    return {
      "&multiLine": {
        highlighter: {
          padding: 5
        },

        input: {
          height: "90px",
          fontSize: font_size,
          border: "1px solid #ccc",
          borderRadius: "4px",
          boxShadow: "inset 0 1px 1px rgba(0,0,0,.075)",
          overflow: "auto",
          padding: "5px 10px"
        }
      },

      suggestions: {
        list: {
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: font_size,
          position: "absolute",
          bottom: "10px",
          overflow: "auto",
          maxHeight: "145px",
          width: "max-content",
          display: "flex",
          flexDirection: "column"
        },

        item: {
          padding: "5px 15px 5px 10px",
          borderBottom: "1px solid rgba(0,0,0,0.15)",

          "&focused": {
            backgroundColor: "rgb(66, 139, 202, 0.4)"
          }
        }
      }
    };
  });

  mentions_data = memoizeOne((project_users: immutable.Map<string, any>) => {
    const user_array = project_users
      .keySeq()
      .filter(account_id => {
        return account_id !== this.props.account_id;
      })
      .map(account_id => {
        return {
          id: account_id,
          display: this.props.user_store.get_name(account_id),
          last_active: this.props.user_store.get_last_active(account_id)
        };
      })
      .toJS();

    user_array.sort((x, y) => -cmp_Date(x.last_active, y.last_active));

    return user_array;
  });

  on_change = (e, _, __, mentions) => {
    this.props.on_change(e.target.value, mentions);
  };

  on_keydown = (e: any) => {
    // TODO: Add timeout component to is_typing
    if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault();
      if (this.props.input.length && this.props.input.trim().length >= 1) {
        this.props.on_send(this.props.input);
      }
    } else if (e.keyCode === 38 && this.props.input === "") {
      // Up arrow on an empty input
      this.props.on_set_to_last_input();
    } else if (e.keyCode === 27) {
      // Esc
      this.props.on_clear();
    }
  };

  render_user_suggestion = (entry: { id: string; display: string }) => {
    return (
      <span>
        <Avatar size={this.props.font_size + 12} account_id={entry.id} />
        <Space />
        <Space />
        {entry.display}
      </span>
    );
  };

  render() {
    const user_array = this.mentions_data(this.props.project_users);

    const style =
      this.props.input_style || this.input_style(this.props.font_size);

    return (
      <MentionsInput
        autoFocus={!IS_MOBILE || isMobile.Android()}
        displayTransform={(_, display) => "@" + display}
        style={style}
        markup={USER_MENTION_MARKUP}
        inputRef={this.props.input_ref}
        onKeyDown={this.on_keydown}
        value={this.props.input}
        placeholder={
          this.props.enable_mentions
            ? "Type a message, @name..."
            : "Type a message..."
        }
        onPaste={this.props.on_paste}
        onChange={this.on_change}
      >
        <Mention
          trigger="@"
          data={user_array}
          appendSpaceOnAdd={true}
          renderSuggestion={this.render_user_suggestion}
        />
      </MentionsInput>
    );
  }
}
