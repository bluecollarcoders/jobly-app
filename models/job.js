"use strict";

const db = require("../db")
const { NotFoundError } =("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/* Related function for companies.  */

class Job { 
    /* Create a job (from data), update db, return new job data.
    
     use jobly.sql as point of reference for Job model


    data should be { title, salary, equity, companyHandle }
    
    Returns { id, title, salary, equity, companyHandle }
    */

    static async create(data) {
    const result = await db.query(
          `INSERT INTO jobs (title,
                             salary,
                             equity,
                             company_handle)
           VALUES ($1, $2, $3, $4)
           RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
        [
          data.title,
          data.salary,
          data.equity,
          data.companyHandle,
        ]);
    let job = result.rows[0];

    return job;
  }
  
  /* Find all jobs (optional filer on searchFilters).
  
  searchFilters (all optional):

  minSalary

  hasEquity (true returns only jobs with equity > 0, other values ignored)

  title (will find case insensitive, partial matches)

  Returns [{ id, title, salary, equity, companyHandle, companyName}, ...]
  
  */

  static async findAll({ minSalary, hasEquity, title } = {}) {
      let query = `SELECT j.id,
                          j.title,
                          j.salary,
                          j.equity,
                          j.company_handle AS "companyHandle",
                          c.name AS "companyName"
                    FROM jobs j
                      LEFT JOIN companies AS c ON c.handle = j.company_handle`;
                let whereExpressions = [];
                let queryValues = [];

                // For each possible search term, add to whereExpressions and
                // queryValues so we can generate the right SQL

                if (minSalary !== undefined) {
                    queryValues.push(minSalary);
                    whereExpressions.push(`salary >= $${queryValues.length}`);
                }

                if (hasEquity === true) {
                    queryValues.push(`%${title}%`);
                    whereExpressions.push(`title ILIKE $${queryValues.length}`);
                }

                if (whereExpressions.length > 0) {
                    query += "WHERE" + whereExpressions.join(" AND ");
                }

                // Finalize query and return results

                query += "ORDER BY title";
                const jobRes = await db.query(query, queryValues);
                return jobRes.rows;
  }





}

module.exports = Job;