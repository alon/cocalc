/*
Frame that display a Jupyter notebook in the traditional way with input and output cells.
*/

import { Loading } from "../../../r_misc/loading";

import { React, Rendered, Component } from "../../../app-framework";

import { JupyterEditor } from "../../../jupyter/main";

import { redux_name } from "../jupyter-actions";

import { Map } from "immutable";

interface Props {
  id: string;
  name: string;
  actions: any;
  editor_state: Map<string, any>;
  is_fullscreen: boolean;
  project_id: string;
  path: string;
  font_size: number;
  is_current: boolean;
  desc: Map<string, any>;
}

export class CellNotebook extends Component<Props, {}> {
  private data(key: string, def?: any): any {
    return this.props.desc.get("data-" + key, def);
  }

  render(): Rendered {
    const name = redux_name(this.props.name);

    // Actions for the underlying Jupyter notebook state, kernel state, etc.
    const jupyter_actions = this.props.actions.redux.getActions(name);
    if (jupyter_actions == null) {
      return <Loading />;
    }
    // Actions specific to a particular frame view of the notebook
    // in the browser client.
    const frame_actions = this.props.actions.get_frame_actions(this.props.id);
    if (frame_actions == null) {
      return <Loading />;
    }
    return (
      <JupyterEditor
        actions={jupyter_actions}
        frame_actions={frame_actions}
        name={name}
        is_focused={this.props.is_current}
        is_fullscreen={this.props.is_fullscreen}
        font_size={this.props.font_size}
        mode={this.data("mode", "escape")}
        cur_id={this.data("cur_id")}
        sel_ids={this.data("sel_ids")}
        md_edit_ids={this.data("md_edit_ids")}
        scroll={this.data("scroll")}
        scrollTop={this.data("scrollTop")}
        hook_offset={this.data("hook_offset")}
        view_mode={this.data("view_mode", "normal")}
      />
    );
  }
}
