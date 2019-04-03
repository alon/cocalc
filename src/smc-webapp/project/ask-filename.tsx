import { Component, React, /* ReactDOM,*/ Rendered } from "../app-framework";
const { file_options } = require("../editor");
const {
  Col,
  Row,
  ButtonToolbar,
  ControlLabel,
  Button,
  Form
} = require("react-bootstrap");
const { SearchInput, SelectorInput, Icon } = require("../r_misc");
const { IS_TOUCH } = require("../feature");
import { RandomFilenameFamilies } from "smc-webapp/project/utils";

interface Props {
  actions: any;
  ext_selection: string;
  current_path: string;
  new_filename?: string;
  other_settings: any;
}

interface State {}

export class AskNewFilename extends Component<Props, State> {
  private searchRef: React.RefObject<HTMLInputElement>;
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
  }

  cancel = (): void => {
    this.props.actions.ask_filename(undefined);
  };

  shuffle = (): void => {
    this.props.actions.ask_filename(this.props.ext_selection);
    // TODO somehow focus & select the new random text
    //const el = this.searchRef.current;
    //if (el != null) {
    //  ReactDOM.findDOMNode(el.refs.input).select();
    //}
  };

  create = (name, focus): void => {
    this.props.actions.ask_filename(undefined);
    this.props.actions.create_file({
      name: name,
      ext: this.props.ext_selection,
      current_path: this.props.current_path,
      switch_over: focus
    });
  };

  submit = (val: string, opts: any): void => {
    this.create(val, !opts.ctrl_down);
  };

  create_click = (): void => {
    this.create(this.props.new_filename, true);
  };

  change = (val: string): void => {
    this.props.actions.setState({ new_filename: val });
  };

  render_filename() {
    const data: any = file_options(`foo.${this.props.ext_selection}`);
    return data.name;
  }

  change_random = (family: string) => {
    this.props.actions.set_random_filename_family(family);
    this.shuffle();
  };

  render(): Rendered {
    if (this.props.new_filename == null) return <div>Loading …</div>;
    return (
      <Row style={{ marginBottom: "10px" }}>
        <Col md={6} mdOffset={0} lg={4} lgOffset={0}>
          <ControlLabel>
            Enter name for new {this.render_filename()} file:
          </ControlLabel>
          <Form>
            <SearchInput
              autoFocus={!IS_TOUCH}
              autoSelect={!IS_TOUCH}
              ref={this.searchRef}
              type={"text"}
              value={this.props.new_filename}
              placeholder={"Enter filename..."}
              on_submit={this.submit}
              on_escape={this.cancel}
              on_change={this.change}
            />
            <Row>
              <Col md={5}>
                <SelectorInput
                  selected={this.props.other_settings.get("random_filenames")}
                  options={RandomFilenameFamilies}
                  on_change={this.change_random}
                />
              </Col>

              <Col md={7}>
                <ButtonToolbar style={{ whiteSpace: "nowrap", padding: "0" }}>
                  <Button onClick={this.shuffle}>
                    <Icon name={"dice"} />
                  </Button>
                  <Button
                    className={"pull-right"}
                    bsStyle={"primary"}
                    onClick={this.create_click}
                    disabled={this.props.new_filename.length == 0}
                  >
                    <Icon name={"plus-circle"} /> Create
                  </Button>
                  <Button className={"pull-right"} onClick={this.cancel}>
                    Cancel
                  </Button>
                </ButtonToolbar>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    );
  }
}
