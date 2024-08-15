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
    public partial class ACCESSORIES : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True" ;
        SqlConnection conn ;
        string showmessage = "" ;
        string querry = "" ;
        string value ;

        public ACCESSORIES()
        {
            InitializeComponent();
            
        }

        public ACCESSORIES(string value)
        {
            InitializeComponent();
            this.value = value;
        }

        private void ACCESSORIES_Load(object sender, EventArgs e)
        {
            valuelbl.Text = value;
            getID();
            dgvpop();
            get_CAT();
            get_brand();
            if(brandcombo.Text=="")
            {
                get_PROVIDER();
            }
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
                MessageBox.Show(e.Message);
            }
        }

        private void getID()
        {
            try
            {

                SqlConnection connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select ID from ACCESSORIES order by ID desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    acc_ID.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    acc_ID.Text = "1000000";
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

            SqlDataAdapter adapter = new SqlDataAdapter("Select * from accessories order by id desc", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            mobdgv.DataSource = dt;

            conn.Close();
        }

        private void get_CAT()
        {

            conn = new SqlConnection(ConnectionString);
            SqlCommand sqlCmd = new SqlCommand("select * from ACC_CAT", conn);
            conn.Open();

            SqlDataReader sqlReader = sqlCmd.ExecuteReader();

            while (sqlReader.Read())
            {
                subcatcombo.Items.Add(sqlReader["NAME"].ToString());
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
                brandcombo.Items.Add(sqlReader["NAME"].ToString());
            }
            

        }

        private void get_PROVIDER()
        {
            if (brandcombo.Text.Length > 0)
            {
                providercombo.Items.Clear();
                conn = new SqlConnection(ConnectionString);
                SqlCommand sqlCmd = new SqlCommand("select * from SUPPLIER WHERE brand ='" + brandcombo.Text + "'", conn);
                conn.Open();

                SqlDataReader sqlReader = sqlCmd.ExecuteReader();

                while (sqlReader.Read())
                {
                    providercombo.Items.Add(sqlReader["NAME"].ToString());
                }
            }
            else
            {
                conn = new SqlConnection(ConnectionString);
                SqlCommand sqlCmd = new SqlCommand("select * from SUPPLIER ", conn);
                conn.Open();

                SqlDataReader sqlReader = sqlCmd.ExecuteReader();

                while (sqlReader.Read())
                {
                    providercombo.Items.Add(sqlReader["NAME"].ToString());
                }
                
            }

        }

        private void clear_valu()
        { 
            nametxt.Text = "";
            modeltxt.Text = "";
            subcatcombo.SelectedIndex = -1;
            brandcombo.SelectedIndex = -1;
            providercombo.SelectedIndex = -1;
            QUANTITYTXT.Text = "";
            UNITCOMBO.SelectedIndex = -1;
            SELPRICETXT.Text = "";
            COSTPRICETXT.Text = "";
            PROFIT.Text = "000";
        }

        private void brandcombo_SelectedIndexChanged(object sender, EventArgs e)
        {
            get_PROVIDER();
        }

        private void prosavebtn_Click(object sender, EventArgs e)
        {
            if (subcatcombo.Text == "")
            {
                subcatcombo.Focus();
            }
            else
           if (nametxt.Text == "")
            {
                nametxt.Focus();

            }
            else
           if (modeltxt.Text == "")
            {
                modeltxt.Focus();

            }
            else
           if (brandcombo.Text == "")
            {
                brandcombo.Focus();

            }
            else
           if (providercombo.Text == "")
            {
                 providercombo.Focus();

            }
           
            else
           if (QUANTITYTXT.Text == "")
            {
                QUANTITYTXT.Focus();

            }
            else
           if (UNITCOMBO.Text == "")
            {
                UNITCOMBO.Focus();

            }
            else
           if (COSTPRICETXT.Text == "")
            {
                COSTPRICETXT.Focus();

            }
            else
           if (SELPRICETXT.Text == "")
            {
                SELPRICETXT.Focus();

            }
            else
            {
                showmessage = "SAVED";

                querry = "insert into ACCESSORIES values('" + acc_ID.Text + "','" + subcatcombo.Text + "','"
                    + nametxt.Text + "','" + modeltxt.Text + "','" + brandcombo.Text + "','" + providercombo.Text + "','"
                     + QUANTITYTXT.Text + "','" + UNITCOMBO.Text + "','"+ COSTPRICETXT.Text + "','" 
                     + SELPRICETXT.Text + "','" + PROFIT.Text + "')";
                databaseCRUD(querry, showmessage);
                //get_brand();
                dgvpop();
                clear_valu();

            }
        }

        private void proupdatebtn_Click(object sender, EventArgs e)
        {
            showmessage = " DATA Updated";
            querry = "Update ACCESSORIES SET category='" + subcatcombo.Text
                        + "',name='" + nametxt.Text + "',model='" + modeltxt.Text +
                        "',brand='" + brandcombo.Text + "',supplier='" + providercombo.Text
                        + "',quantity = '" + QUANTITYTXT.Text + "',unit = '" + UNITCOMBO.Text
                        + "',cost = '" + COSTPRICETXT.Text + "',PRICE = '" + SELPRICETXT.Text
                        + "',profit = '" + PROFIT.Text + "'  where ID= '" + acc_ID.Text + "'";
            databaseCRUD(querry, showmessage);
            clear_valu();
            dgvpop();
        }

        private void prodeletebtn_Click(object sender, EventArgs e)
        {
            showmessage = "DELETED";
            querry = "Delete ACCESSORIES where ID = '" + acc_ID.Text + "'";
            databaseCRUD(querry, showmessage);

            dgvpop();
            clear_valu();
        }

        private void clear_Click(object sender, EventArgs e)
        {
            clear_valu();
        }

        private void SELPRICETXT_TextChanged(object sender, EventArgs e)
        {
            if (SELPRICETXT.Text.Length > 0)
            {
                PROFIT.Text = (int.Parse(SELPRICETXT.Text) - int.Parse(COSTPRICETXT.Text)).ToString();
            }
            else
            {
                SELPRICETXT.Focus();
                PROFIT.Text = "000";
            }
        }

        private void brandcombo_SelectedIndexChanged_1(object sender, EventArgs e)
        {
            get_PROVIDER();
              
        }

        private void mobdgv_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (mobdgv.CurrentRow.IsNewRow)
            {
                getID();
                nametxt.Text = "";
                modeltxt.Text = "";
                subcatcombo.SelectedIndex = -1;
                brandcombo.SelectedIndex = -1;
                providercombo.SelectedIndex = -1;
                QUANTITYTXT.Text = "";
                UNITCOMBO.SelectedIndex = -1;
                SELPRICETXT.Text = "";
                COSTPRICETXT.Text = "";
                PROFIT.Text = "000";

            }
            else
            {
                mobdgv.CurrentRow.Selected = true;
                acc_ID.Text = mobdgv.Rows[e.RowIndex].Cells["ID"].FormattedValue.ToString();
                subcatcombo.Text = mobdgv.Rows[e.RowIndex].Cells["CATEGORY"].FormattedValue.ToString();
                nametxt.Text = mobdgv.Rows[e.RowIndex].Cells["NAME"].FormattedValue.ToString();
                modeltxt.Text = mobdgv.Rows[e.RowIndex].Cells["model"].FormattedValue.ToString();
                brandcombo.Text = mobdgv.Rows[e.RowIndex].Cells["BRAND"].FormattedValue.ToString();
                providercombo.Text = mobdgv.Rows[e.RowIndex].Cells["SUPPLIER"].FormattedValue.ToString();
                QUANTITYTXT.Text = mobdgv.Rows[e.RowIndex].Cells["quantity"].FormattedValue.ToString();
                UNITCOMBO.Text = mobdgv.Rows[e.RowIndex].Cells["unit"].FormattedValue.ToString();
                COSTPRICETXT.Text = mobdgv.Rows[e.RowIndex].Cells["cost"].FormattedValue.ToString();
                SELPRICETXT.Text = mobdgv.Rows[e.RowIndex].Cells["PRICE"].FormattedValue.ToString();
                PROFIT.Text = mobdgv.Rows[e.RowIndex].Cells["profit"].FormattedValue.ToString();
            }
        }
    }
}
