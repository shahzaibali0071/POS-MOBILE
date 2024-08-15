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
    public partial class MOBILE : Form
    {
        string ConnectionString = "Data Source=shahzaib-ali;Initial Catalog=mobile_shop;Integrated Security=True";
        SqlConnection conn;
        string showmessage = "";
        string querry = "";
        string value;


        public MOBILE(string value)
        {
            InitializeComponent();
            this.value = value;

        }

        private void MOBILE_Load(object sender, EventArgs e)
        {
            valuelbl.Text = value;
            PTAcombo.SelectedIndex = 0;
            getID();
            dgvpop();
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

        private void clear_valu()
        {
            companycombo.SelectedIndex = 0;
            seriestxt.Text = "";
            modeltxt.Text = "";
            imei1txt.Text = "";
            imei2txt.Text = "";
            colortxt.Text = "";
            QUANTITYTXT.Text = "";
            UNITCOMBO.SelectedIndex = 0;
            SELPRICETXT.Text = "";
            COSTPRICETXT.Text = "";
            PTAcombo.SelectedIndex = 0;
            getID();
        }

        private void getID()
        {
            try
            {

                SqlConnection connect = new SqlConnection(ConnectionString);
                SqlDataAdapter sda = new SqlDataAdapter("Select ID from mobile order by ID desc", connect);
                DataSet ds = new DataSet();
                sda.Fill(ds);
                if (ds.Tables[0].Rows.Count > 0)
                {
                    mob_id.Text = (Convert.ToInt32(ds.Tables[0].Rows[0][0].ToString()) + 1).ToString();
                }
                else
                {
                    mob_id.Text = "100";
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

            SqlDataAdapter adapter = new SqlDataAdapter("Select * from mobile order by id desc", conn);
            DataTable dt = new DataTable();
            adapter.Fill(dt);
            mobdgv.DataSource = dt;

            conn.Close();
        }

        private void SELPRICETXT_TextChanged(object sender, EventArgs e)
        {
            if (SELPRICETXT.Text.Length > 0)
            {
                PROFIT.Text = (Convert.ToInt32(SELPRICETXT.Text) - Convert.ToInt32(COSTPRICETXT.Text)).ToString();
            }
            else
            {
                SELPRICETXT.Focus();
                PROFIT.Text = "000";
            }
        }

        private void prosavebtn_Click_1(object sender, EventArgs e)
        {
            if (companycombo.Text == "")
            {
                companycombo.Focus();
            }
            if (imei1txt.Text == "")
            {
                imei1txt.Text = "12345678901234";
                // imei1txt.Focus();
            }
            if (imei2txt.Text == "")
            {
                imei2txt.Text = "12345678901234";
                // imei2txt.Focus();
            }else
            if (modeltxt.Text == "")
            {
                modeltxt.Focus();
            }
            else
             if (colortxt.Text == "")
            {
                colortxt.Focus();
            }
            else
            if (PTAcombo.Text == "")
            {
                PTAcombo.Focus();

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
                if (seriestxt.Text == "")
                {
                    showmessage = "SAVED";

                    querry = "insert into mobile values('" + mob_id.Text + "','" + companycombo.Text + "','"
                        + seriestxt.Text + "','" + modeltxt.Text + "','" + imei1txt.Text + "','" + imei2txt.Text + "','"
                        + colortxt.Text + "','" + PTAcombo.Text + "','" + QUANTITYTXT.Text + "','" + UNITCOMBO.Text + "','"
                        + COSTPRICETXT.Text + "','" + SELPRICETXT.Text + "','" + PROFIT.Text + "')";
                    databaseCRUD(querry, showmessage);
                    dgvpop();
                    clear_valu();
                }
                else
                {
                    showmessage = "SAVED";

                    querry = "insert into mobile values('" + mob_id.Text + "','" + companycombo.Text + "','"
                        + seriestxt.Text + "','" + seriestxt.Text + " - " + modeltxt.Text + "','" + imei1txt.Text + "','" + imei2txt.Text + "','"
                        + colortxt.Text + "','" + PTAcombo.Text + "','" + QUANTITYTXT.Text + "','" + UNITCOMBO.Text + "','"
                        + COSTPRICETXT.Text + "','" + SELPRICETXT.Text + "','" + PROFIT.Text + "')";
                    databaseCRUD(querry, showmessage);
                    dgvpop();
                    companycombo.Focus();
                    clear_valu();
                }
            }
        }

        private void prodeletebtn_Click_1(object sender, EventArgs e)
        {
            showmessage = "DELETED";
            querry = "Delete mobile where ID = '" + mob_id.Text + "'";
            databaseCRUD(querry, showmessage);

            dgvpop();
            clear_valu();
        }

        private void proupdatebtn_Click(object sender, EventArgs e)
        {

            showmessage = " DATA Updated";
            querry = "Update mobile SET company='" + companycombo.Text
                        + "',series='" + seriestxt.Text + "',model='" + modeltxt.Text +
                        "',imei1='" + imei1txt.Text + "',imei2='" + imei2txt.Text
                        + "',color = '" + colortxt.Text + "',pta = '" + PTAcombo.Text
                        + "',quantity = '" + QUANTITYTXT.Text + "',unit = '" + UNITCOMBO.Text
                        + "',cost = '" + COSTPRICETXT.Text + "',PRICE = '" + SELPRICETXT.Text
                        + "',profit = '" + PROFIT.Text + "'  where ID= '" + mob_id.Text + "'";
            databaseCRUD(querry, showmessage);
            clear_valu();
            dgvpop();
        }

        private void clear_Click_1(object sender, EventArgs e)
        {
            clear_valu();
        }

        private void mobdgv_CellClick(object sender, DataGridViewCellEventArgs e)
        {
            if (mobdgv.CurrentRow.IsNewRow)
            {
                getID();
                companycombo.SelectedIndex = 0;
                seriestxt.Text = "";
                modeltxt.Text = "";
                imei1txt.Text = "";
                imei2txt.Text = "";
                colortxt.Text = "";
                QUANTITYTXT.Text = "";
                UNITCOMBO.SelectedIndex = 0;
                SELPRICETXT.Text = "";
                COSTPRICETXT.Text = "";
                PTAcombo.SelectedIndex = 0;
            }
            else
            {
                mobdgv.CurrentRow.Selected = true;
                mob_id.Text = mobdgv.Rows[e.RowIndex].Cells["ID"].FormattedValue.ToString();
                companycombo.Text = mobdgv.Rows[e.RowIndex].Cells["company"].FormattedValue.ToString();
                seriestxt.Text = mobdgv.Rows[e.RowIndex].Cells["series"].FormattedValue.ToString();
                modeltxt.Text = mobdgv.Rows[e.RowIndex].Cells["model"].FormattedValue.ToString();
                imei1txt.Text = mobdgv.Rows[e.RowIndex].Cells["imei1"].FormattedValue.ToString();
                imei2txt.Text = mobdgv.Rows[e.RowIndex].Cells["imei2"].FormattedValue.ToString();
                colortxt.Text = mobdgv.Rows[e.RowIndex].Cells["color"].FormattedValue.ToString();
                PTAcombo.Text = mobdgv.Rows[e.RowIndex].Cells["pta"].FormattedValue.ToString();
                QUANTITYTXT.Text = mobdgv.Rows[e.RowIndex].Cells["quantity"].FormattedValue.ToString();
                UNITCOMBO.Text = mobdgv.Rows[e.RowIndex].Cells["unit"].FormattedValue.ToString();
                COSTPRICETXT.Text = mobdgv.Rows[e.RowIndex].Cells["cost"].FormattedValue.ToString();
                SELPRICETXT.Text = mobdgv.Rows[e.RowIndex].Cells["PRICE"].FormattedValue.ToString();
                PROFIT.Text = mobdgv.Rows[e.RowIndex].Cells["profit"].FormattedValue.ToString();
            }
        }

        private void imei1txt_Click(object sender, EventArgs e)
        {
            if (imei1txt.Text.Length > 0)
            {
                imei1txt.Text = "";
            }
        }

        private void imei2txt_Click(object sender, EventArgs e)
        {
            if (imei2txt.Text.Length > 0)
            {
                imei2txt.Text = "";
            }
        }

        private void mobdgv_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {

        }
    }
}
