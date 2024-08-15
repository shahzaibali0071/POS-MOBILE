using System;
using System.Data;
using System.Data.SqlClient;
using System.Windows.Forms;

namespace POS_MOBILE
{
    public partial class DEMAND : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        string showmessage = "";
        string querry = "";
       
        public DEMAND()
        {
            InitializeComponent();
        }

        private void brandlistcombo_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void demsavebtn_Click(object sender, EventArgs e)
        {
            if (demdescriptiontxt.Text == "")
            {
                demdescriptiontxt.Focus();
            }
            else
            if (demqtytxt.Text == "")
            {
                demqtytxt.Focus();

            }
            else
            if (demlistcombo.Text == "")
            {
                demlistcombo.Focus();

            }
            else
            if (deminstructiontxt.Text == "")
            {
                deminstructiontxt.Focus();

            }
            else
            { 
                showmessage = "SAVED";

                querry = "insert into demand values('" + demid.Text + "','" + demdescriptiontxt.Text + "','" + demqtytxt.Text + "','" + demlistcombo.Text + "','" + deminstructiontxt.Text +  "')";
                databaseCRUD(querry, showmessage);
                //get_brand();
                dgvpop();
                clear_valu();

            }
        }

        private void demupdatebtn_Click(object sender, EventArgs e)
        {

            showmessage = " DEMAND Updated";
            querry = "Update DEMAND SET description='" + demdescriptiontxt.Text
                        + "',quantity='"  + demqtytxt.Text 
                        + "',STATUS='" + demlistcombo.Text 
                        + "',instruction='" + deminstructiontxt.Text 
                        + "'  where ID= '" + demid.Text + "'";
            databaseCRUD(querry, showmessage);
            clear_valu();
            dgvpop();
            //get_brand();
        }

        private void demdeletebtn_Click(object sender, EventArgs e)
        {
            if(demdescriptiontxt.Text=="")
            {
                MessageBox.Show("PLZ... FIRST SELECT FROM TABLE THAT U WANT TO DELETE !!!");
            }
            else
            {
                showmessage = "DELETED";
                querry = "Delete demand where id = '" + demid.Text + "'";
                databaseCRUD(querry, showmessage);

                //get_brand();
                dgvpop();
                clear_valu();
            }
            

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
                MessageBox.Show(e.Message);
            }
        }

        private void demdgv_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (demdgv.CurrentRow.IsNewRow)
            {
                getID();
                demdescriptiontxt.Text = "";
                demqtytxt.Text = "";
                deminstructiontxt.Text = "";
                demlistcombo.SelectedIndex = 0;

            }

            else
            {
                demdgv.CurrentRow.Selected = true;
                demid.Text = demdgv.Rows[e.RowIndex].Cells["ID"].FormattedValue.ToString();
                demdescriptiontxt.Text = demdgv.Rows[e.RowIndex].Cells["Description"].FormattedValue.ToString();
                demqtytxt.Text = demdgv.Rows[e.RowIndex].Cells["quantity"].FormattedValue.ToString();
                demlistcombo.Text = demdgv.Rows[e.RowIndex].Cells["STATUS"].FormattedValue.ToString();
                deminstructiontxt.Text = demdgv.Rows[e.RowIndex].Cells["instruction"].FormattedValue.ToString();

            }
            

        }

        private void clear_valu()
        {

            showmessage = "";
            demdescriptiontxt.Text = "";
            demqtytxt.Text = "";
            deminstructiontxt.Text = "";
            demlistcombo.SelectedIndex = 0;

        }

        private void getID()
        {
            try
            {

                SqlConnection connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select ID from demand order by ID desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    demid.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    demid.Text = "90000000";
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

            SqlDataAdapter adapter = new SqlDataAdapter("select * from demand Order by status ", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            demdgv.DataSource = dt;

            conn.Close();
        
        }

        private void DEMAND_Load(object sender, EventArgs e)
        {
            getID();
            dgvpop();
            demlistcombo.SelectedIndex = 0;
        }
    }
}
