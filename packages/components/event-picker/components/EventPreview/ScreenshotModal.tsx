import React from 'react';
import Modal from '@gio-design-old/components/lib/modal';
import Button from '@gio-design-old/components/lib/button';

interface Props {
  src: string,
  onOpen?: () => void,
}

interface State {
  visible: boolean
}

class ScreenshotModal extends React.PureComponent<Props, State> {

  public state: State = {
    visible: false
  }

  private node = null;

  public render() {

    return (
      <div className='screenshotModal'>
        <div ref={this.setRef} />
        <Modal
          width={800}
          title={null}
          footer={null}
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
          onCancel={this.handleCanel}
          getContainer={this.getRef}
        >
          <img src={this.props.src} style={{ width: '100%' }} />
        </Modal>
        <Button
          className='btn-view-screenshot'
          onClick={this.handleOpen}
          type="primary"
        >
          查看页面截图
        </Button>
      </div>
    );
  }

  private handleOpen = () => this.handleVisibleChange(true);

  private handleCanel = () => this.handleVisibleChange(false);

  private handleVisibleChange = (visible: boolean) => this.setState({ visible });

  private setRef = (node: any) => this.node = node;

  private getRef = () => this.node;
}

export default ScreenshotModal;
