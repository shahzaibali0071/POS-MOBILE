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
    public partial class CUSTOMER : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        string showmessage = "";
        string querry = "";

        public CUSTOMER()
        {
            InitializeComponent();
        }

        private void CUSTOMER_Load(object sender, EventArgs e)
        {
            getID();
            dgvpop();
        }

        private void custsavebtn_Click(object sender, EventArgs e)
        {
            if (custnametxt.Text == "")
            {
                custnametxt.Focus();
            }
            else
            if (custemailtxt.Text == "")
            {
                custemailtxt.Focus();

            }
            else
            if (custcnictxt.Text == "")
            {
                custcnictxt.Focus();

            }
            else
            if (custmobiletxt.Text == "")
            {
                custmobiletxt.Focus();

            }
            else
            if (custaddresstxt.Text == "")
            {
                custaddresstxt.Focus();

            }
            else
            
            {
                showmessage = " SAVED";

                querry = "insert into customer values('" + custid.Text + "','" + custnametxt.Text + "','" + custemailtxt.Text + "','" + custcnictxt.Text + "','" + custmobiletxt.Text + "','" + custaddresstxt.Text + "')";
                databaseCRUD(querry, showmessage);
                dgvpop();
                clear_valu();

            }
        }

        private void custupdatebtn_Click(object sender, EventArgs e)
        {
            showmessage = " CUSTOMER Updated";
            querry = "Update Customer SET NAME='" + custnametxt.Text
                        + "',email='" + custemailtxt.Text + "',cnic='" + custcnictxt.Text +
                        "',mob_no='" + custmobiletxt.Text + "',address='" + custaddresstxt.Text
                        + "'  where Cust_ID= '" + custid.Text + "'";
            databaseCRUD(querry, showmessage);
            clear_valu();
            dgvpop();
        }

        private void custdeletebtn_Click(object sender, EventArgs e)
        {
            showmessage = "DELETED";
            querry = "Delete customer where NAME = '" + custnametxt.Text + "'";
            databaseCRUD(querry, showmessage);

            
            dgvpop();
            clear_valu();
        }

        private void clear_Click(object sender, EventArgs e)
        {
            clear_valu();
        }

        private void databaseCRUD(string savequerry, string message)
        {
            try
            {
                conn = new SqlConnection(ConnectionString);
                SqlCommand cmd = null;
                conn.Open();
                cmd = new SqlCommand(savequerry, conn);
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
                conn.Close();
                MessageBox.Show("Successfully " + message);
                clear_valu();
            }
            catch (Exception e)
            {
                MessageBox.Show(e.ToString());
            }
        }

        private void clear_valu()
        {
            
                showmessage = "";
                custnametxt.Text = "";
                custemailtxt.Text = "";
                custcnictxt.Text = "";
                custmobiletxt.Text = "";
                custaddresstxt.Text = "";
                
                
            
        }

        private void getID()
        {
            try
            {

                SqlConnection connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select Cust_ID from customer order by Cust_ID desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    custid.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    custid.Text = "7000";
                }


                connect.Close();

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }

        }

        private void dgvpop()
        {
            conn = new SqlConnection(ConnectionString);
            conn.Open();

            SqlDataAdapter adapter = new SqlDataAdapter("select * from Customer Order by Cust_ID desc", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            custdgv.DataSource = dt;

            conn.Close();
        }

        private void custdgv_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (custdgv.CurrentRow.IsNewRow)
            {
                getID();
                clear_valu();
            }
            else
            {
                custdgv.CurrentRow.Selected = true;
                custid.Text = custdgv.Rows[e.RowIndex].Cells["Cust_ID"].FormattedValue.ToString();
                custnametxt.Text = custdgv.Rows[e.RowIndex].Cells["Name"].FormattedValue.ToString();
                custemailtxt.Text = custdgv.Rows[e.RowIndex].Cells["email"].FormattedValue.ToString();
                custcnictxt.Text = custdgv.Rows[e.RowIndex].Cells["cnic"].FormattedValue.ToString();
                custmobiletxt.Text = custdgv.Rows[e.RowIndex].Cells["mob_no"].FormattedValue.ToString();
                custaddresstxt.Text = custdgv.Rows[e.RowIndex].Cells["address"].FormattedValue.ToString();
            }
        }
    }
}
