export default interface Comparison {
  type: 'dimension' | 'segmentation',
  dimension: { id: string, values: string[], selection: number[] },
  segmentation: { id: 'segmentation', values: string[], selection: number[] }
}
