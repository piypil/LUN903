export interface Iscans {
    errors: []
    generated_at: string
    metrics: {}
    results:
        {
            code: string
            col_offset: number
            end_col_offset: number
            filename: string
            issue_confidence : string
            issue_cwe: {
                id: number
                link: string
            }
            issue_severity: string
            issue_text: string
            line_number: number
            line_range: number[]
            more_info: string
            test_id: string
            test_name: string
        }[]
}