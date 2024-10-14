WITH
  transactions_in_two_months AS (
    SELECT
      date,
      category_id,
      amount,
      user_id
    FROM
      transactions
    WHERE
      amount < 0
      AND user_id = 'mrewr5g1n5gfr985lez9co9i'
      AND date >= '2024-08-01'
      AND date <= '2024-09-30'
    ORDER BY
      category_id ASC
  ),
  transactions_by_category AS (
    SELECT
      category_id,
      TO_CHAR(date, 'YYYY-MM') AS MONTH,
      SUM(amount) AS total_amount
    FROM
      transactions_in_two_months
    GROUP BY
      category_id,
      MONTH
  )
SELECT
  category_id,
  JSON_OBJECT_AGG(MONTH, total_amount) AS monthly_transactions
FROM
  transactions_by_category
GROUP BY
  category_id