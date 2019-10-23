import Base from './Base';

export default interface Label extends Base {
  color: 'red' | 'pink' | 'purple' | 'deep-purple'
  | 'deep-orange' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'light-green' | 'green' | 'teal' | 'cyan' | 'light-blue'
  | 'blue' | 'indigo' | 'blue-grey' | 'brown' | 'grey' | 'deep-grey'
}
