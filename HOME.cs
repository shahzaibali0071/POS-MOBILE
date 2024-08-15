using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace POS_MOBILE
{
    public partial class HOME : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        String QUERRY="";
        public HOME()
        {
            InitializeComponent();
        }

        

        private void HOME_Load(object sender, EventArgs e)
        {

            GETSALE();
            GETDEBIT();
            GETEXPENSES();
            QUERRY = "Select * from BILLING ORDER BY DATE DESC ";
            dgvpop(QUERRY);

            if (salelbl.Text=="")
            {
                ERANINGAMT.Text = "0000";

            }else
                if (ACCTOTCASHLBL.Text == "")
            {
                ERANINGAMT.Text = salelbl.Text;

            }
            else

            {
                ERANINGAMT.Text = (int.Parse(salelbl.Text) + int.Parse(ACCTOTCASHLBL.Text)).ToString();

            }
            
            TOTALCASHLBL.Text= (int.Parse(ERANINGAMT.Text) -( int.Parse(PURCHASESAMT.Text)+ int.Parse(EXPENSESAMT.Text))).ToString();


        }
        private void GETEXPENSES()
        {
            conn = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand("SELECT COUNT(ID) AS ID FROM EXPENSES ", conn);
            SqlDataReader reader;
            try
            {
                conn.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                EXPTOTITEMLBL.Text = reader["ID"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            conn = new SqlConnection(ConnectionString);
            SqlCommand cmddb1 = new SqlCommand("SELECT SUM(AMOUNT) AS AMOUNT FROM EXPENSES ", conn);
            SqlDataReader reader1;
            try
            {
                conn.Open();
                reader1 = cmddb1.ExecuteReader();
                reader1.Read();
                EXPENSETOTLBL.Text = reader1["AMOUNT"].ToString();
                EXPENSESAMT.Text = EXPENSETOTLBL.Text;
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
            private void GETDEBIT()
        {
            conn = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand("SELECT COUNT(SALE_ID) AS SALE_ID FROM BILLING WHERE SALE_OF ='CREDIT'", conn);
            SqlDataReader reader;
            try
            {
                conn.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                DEBITITEMLBL.Text = reader["SALE_ID"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

            SqlCommand cmddb1 = new SqlCommand("SELECT SUM(BALANCE) AS BALANCE FROM BILLING WHERE SALE_OF = 'CREDIT'", conn);
            SqlDataReader reader1;
            try
            {
                conn.Open();
                reader1 = cmddb1.ExecuteReader();
                reader1.Read();
                CREDITBAL.Text = reader1["BALANCE"].ToString();
                CREDITAMT.Text = CREDITBAL.Text;
                
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            SqlCommand cmddb2 = new SqlCommand("SELECT SUM(SUB_TOTAL) AS SUB_TOTAL FROM BILLING WHERE SALE_OF = 'CREDIT'", conn);
            SqlDataReader reader2;
            try
            {
                conn.Open();
                reader2 = cmddb2.ExecuteReader();
                reader2.Read();
                CREDITTOT.Text = reader2["SUB_TOTAL"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
        private void GETSALE()
        {
            conn = new SqlConnection(ConnectionString);
            SqlCommand cmddb = new SqlCommand("SELECT COUNT(SALE_ID) AS SALE_ID FROM BILLING", conn);
            SqlDataReader reader;
            try
            {
                conn.Open();
                reader = cmddb.ExecuteReader();
                reader.Read();
                totprolbl.Text = reader["SALE_ID"].ToString();
                SOLDITEMLBL.Text = reader["SALE_ID"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            SqlCommand cmddb1 = new SqlCommand("SELECT SUM(SUB_TOTAL) AS SUB_TOTAL FROM BILLING WHERE SALE_OF = 'CASH' AND PAID_BY ='CASH'", conn);
            SqlDataReader reader1;
            try
            {
                conn.Open();
                reader1 = cmddb1.ExecuteReader();
                reader1.Read();
                salelbl.Text = reader1["SUB_TOTAL"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            SqlCommand cmddb2 = new SqlCommand("SELECT SUM(SUB_TOTAL) AS SUB_TOTAL FROM BILLING WHERE SALE_OF = 'CASH' AND PAID_BY = 'ACCOUNT'", conn);
            SqlDataReader reader2;
            try
            {
                conn.Open();
                reader2 = cmddb2.ExecuteReader();
                reader2.Read();
                ACCTOTCASHLBL.Text = reader2["SUB_TOTAL"].ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            SqlCommand cmddb3 = new SqlCommand("SELECT SUM(PAID_AMT) AS PAID_AMT FROM BILLING WHERE SALE_OF = 'CREDIT'", conn);
            SqlDataReader reader3;
            try
            {
                conn.Open();
                reader3 = cmddb3.ExecuteReader();
                reader3.Read();
                String VAL= reader3["PAID_AMT"].ToString();
                salelbl.Text = (int.Parse(salelbl.Text) + int.Parse(VAL)).ToString();
                conn.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
            //SqlCommand cmddb4 = new SqlCommand("SELECT SUM(BALANCE) AS BALANCE FROM BILLING WHERE SALE_OF = 'CREDIT'", conn);
            //SqlDataReader reader4;
            //try
            //{
            //    conn.Open();
            //    reader4 = cmddb3.ExecuteReader();
            //    reader4.Read();
            //    CREDITBAL.Text = reader4["BALANCE"].ToString();
            //    conn.Close();

            //}
            //catch (Exception ex)
            //{
            //    MessageBox.Show(ex.Message);
            //}
        }

        private void dgvpop(String QUERRY)
        {
            conn = new SqlConnection(ConnectionString);
            conn.Open();

            SqlDataAdapter adapter = new SqlDataAdapter(QUERRY, conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            SUMMARYdataGridView.DataSource = dt;

            conn.Close();
        }

        private void SALEALLBTN_Click_1(object sender, EventArgs e)
        {
            QUERRY = "Select * from BILLING WHERE SALE_OF = 'CASH' ORDER BY DATE DESC ";
            dgvpop(QUERRY);
        }

        private void DEBITALLBTN_Click_1(object sender, EventArgs e)
        {
            QUERRY = "Select * from BILLING WHERE SALE_OF = 'CREDIT'  ORDER BY DATE DESC ";
            dgvpop(QUERRY);
        }

        private void button1_Click(object sender, EventArgs e)
        {
            QUERRY = "Select * from BILLING WHERE DATE BETWEEN '"+dateTimePicker1.Text+"' AND '"+dateTimePicker2.Text+"'  ";
            dgvpop(QUERRY);
        }

        private void EXPENSEALLBTN_Click(object sender, EventArgs e)
        {
            QUERRY = "Select * from EXPENSES ORDER BY DATE DESC";
            dgvpop(QUERRY);
        }
    }
        
}
