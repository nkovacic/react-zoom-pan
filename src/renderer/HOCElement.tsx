import React from 'react';

export interface ViewPortElementProps {
  doObjectMouseDown: Function;
  transform: string;
  box: any;
  id: string;
  children?: any;
}

export class ViewPortElement extends React.PureComponent<ViewPortElementProps> {
  x = 0;
  y = 0;
  w = 100;
  h = 100;
  transform = `1,0,0,1,0,0`;
  id = '';

  constructor(props: ViewPortElementProps) {
    super(props);

    const propsChildren = props.children ? props.children.props : null;
    const { x, y, w, h } = propsChildren;
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.w = w ? w : 100;
    this.h = h ? h : 100;
    this.transform = `1,0,0,1,${this.x},${this.y}`;
    this.id = props.id;
  }

  render() {
    const { transform, children, box } = this.props;
    this.transform = transform ? transform : this.transform;

    if (box) {
      this.w = box.w;
      this.h = box.h;
    }

    return (
      <div
        id={`${this.props.id}`}
        style={{
          overflow: 'hidden',
          transformOrigin: '0% 0%',
          top: 0,
          left: 0,
          height: this.h,
          width: this.w,
          position: 'absolute',
          transform: `matrix(${this.transform})`,
        }}
        onMouseDown={(e) => this.props.doObjectMouseDown(e, null, this)}
      >
        {children}
      </div>
    );
  }
}
