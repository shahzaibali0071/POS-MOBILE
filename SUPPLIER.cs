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
    public partial class SUPPLIER : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        string showmessage = "";
        string querry = "";

        public SUPPLIER()
        {
            InitializeComponent();
        }

        private void SUPPLIER_Load(object sender, EventArgs e)
        {
            get_brand();
            getID();
            dgvpop();
        }

        private void suppsavebtn_Click(object sender, EventArgs e)
        {
            if (supnametxt.Text == "")
            {
                supnametxt.Focus();
            }
            else
            if (supshopnametxt.Text == "")
            {
                supshopnametxt.Focus();

            }
            else
            if (brandlistcombo.Text == "")
            {
                brandlistcombo.Focus();

            }
            else
            if (supcontacttxt.Text == "")
            {
                supcontacttxt.Focus();

            }
            else
            if (supshopaddresstxt.Text == "")
            {
                supshopaddresstxt.Focus();

            }
            else
            if (brandlistcombo.Items.Contains(brandlistcombo.Text))
            {
                showmessage = "SAVED";

                querry = "insert into Supplier values('" + supid.Text + "','" + supnametxt.Text + "','" + supshopnametxt.Text + "','" + brandlistcombo.Text + "','" + supcontacttxt.Text + "','" + supshopaddresstxt.Text + "')";
                databaseCRUD(querry, showmessage);
                get_brand();
                dgvpop();
                clear_valu();

            }
            else
            {
                showmessage = "ADDED BRAND";
                querry = "insert into brand values('" + brandlistcombo.Text + "')"; ;
                databaseCRUD(querry, showmessage);
                get_brand();
                dgvpop();
                clear_valu();
            }
            

        }
    
        private void suppupdatebtn_Click(object sender, EventArgs e)
        {

            showmessage = " SUPPLIER Updated";
            querry = "Update Supplier SET NAME='" + supnametxt.Text
                        + "',shop='" + supshopnametxt.Text + "',brand='" + brandlistcombo.Text +
                        "',mob_no='" + supcontacttxt.Text + "',address='" + supshopaddresstxt.Text
                        + "'  where supp_ID= '" + supid.Text + "'";
           databaseCRUD(querry, showmessage);
            clear_valu();
            dgvpop();
            get_brand();
        }

        private void suppdeletebtn_Click(object sender, EventArgs e)
        {       
            if (supnametxt.Text == "" && brandlistcombo.Text != "")
            {
                showmessage= "BRAND DELETED";
                querry = "Delete brand where name = '" + brandlistcombo.Text + "'";
                databaseCRUD(querry, showmessage);
                
            }
            else
            if (supnametxt.Text == "")
            {
                supnametxt.Focus();
            }
            else
            {
                showmessage = "DELETED";
                querry = "Delete Supplier where NAME = '" + supnametxt.Text + "'";
                databaseCRUD(querry, showmessage);
            }
            get_brand();
            dgvpop();
            clear_valu();
        }

        private void databaseCRUD(string savequerry,string message)
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
                MessageBox.Show("Successfully "+ message);
                clear_valu();
              }
            catch(Exception e)
             {
                    MessageBox.Show(e.Message);
              }
        }

        private void suppdgv_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (suppdgv.CurrentRow.IsNewRow)
            {
                getID();
                supnametxt.Text = "";
                supcontacttxt.Text = "";
                supshopaddresstxt.Text = "";
                supshopnametxt.Text = "";
                brandlistcombo.Text = "";
                brandlistcombo.Items.Clear();
            }
            else
            {
                suppdgv.CurrentRow.Selected = true;
                supid.Text = suppdgv.Rows[e.RowIndex].Cells["supp_ID"].FormattedValue.ToString();
                supnametxt.Text = suppdgv.Rows[e.RowIndex].Cells["Name"].FormattedValue.ToString();
                supshopnametxt.Text = suppdgv.Rows[e.RowIndex].Cells["shop"].FormattedValue.ToString();
                brandlistcombo.Text = suppdgv.Rows[e.RowIndex].Cells["brand"].FormattedValue.ToString();
                supcontacttxt.Text = suppdgv.Rows[e.RowIndex].Cells["mob_no"].FormattedValue.ToString();
                supshopaddresstxt.Text = suppdgv.Rows[e.RowIndex].Cells["address"].FormattedValue.ToString();
            }
        }

        private void get_brand()
        {

            conn = new SqlConnection(ConnectionString);
            SqlCommand sqlCmd = new SqlCommand("select * from brand", conn);
            conn.Open();

            SqlDataReader sqlReader = sqlCmd.ExecuteReader();

            while (sqlReader.Read())
            {
                brandlistcombo.Items.Add(sqlReader["NAME"].ToString());
            }

        }

        private void clear_valu()
        {
            if(supnametxt.Text =="")
            {
                brandlistcombo.Text = "";
                brandlistcombo.Items.Clear();
            }
            else
            {
                showmessage = "";
                supnametxt.Text = "";
                supcontacttxt.Text = "";
                supshopaddresstxt.Text = "";
                supshopnametxt.Text = "";
                brandlistcombo.Text = "";
                brandlistcombo.Items.Clear();
                //suppdgv.Rows.Clear();
            }
        }

        private void getID()
        {
            try
            {

                SqlConnection connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select supp_ID from Supplier order by supp_ID desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    supid.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    supid.Text = "1000";
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

            SqlDataAdapter adapter = new SqlDataAdapter("select * from Supplier Order by supp_ID desc", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            suppdgv.DataSource = dt;

            conn.Close();
        }

        private void clear_Click(object sender, EventArgs e)
        {
            clear_valu();
            get_brand();
            dgvpop();
        }

        private void supnametxt_TextChanged(object sender, EventArgs e)
        {
            try
            {
                conn = new SqlConnection(ConnectionString);

                conn.Open();
                SqlDataAdapter adapter = new SqlDataAdapter("select * from Supplier where NAME like '%" + supnametxt.Text + "%'", conn);
                DataTable dt = new DataTable();
                adapter.Fill(dt);
                suppdgv.DataSource = dt;


                conn.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }
    }
}
