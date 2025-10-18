use std::str::FromStr;

use serde::Deserialize;
use serde::Serialize;
use sqlx::postgres::PgRow;
use sqlx::FromRow;
use sqlx::Row;

#[derive(Serialize, Deserialize, Clone)]
pub struct AttachmentRepositoryModel {
    pub id: i32,
    pub name: String,
    pub attachment: Vec<u8>,
    pub file_type: AttachmentFileType,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum AttachmentFileType {
    #[serde(rename = "PNG")]
    Png,
    #[serde(rename = "JPEG")]
    Jpeg,
}

impl FromRow<'_, PgRow> for AttachmentRepositoryModel {
    fn from_row(row: &'_ PgRow) -> Result<Self, sqlx::Error> {
        let file_type: String = row.try_get("file_type")?;
        let file_type =
            AttachmentFileType::from_str(&file_type).map_err(|e| sqlx::Error::Decode(e.into()))?;
        Ok(Self {
            id: row.try_get("id")?,
            name: row.try_get("name")?,
            attachment: row.try_get("content")?,
            file_type,
        })
    }
}

impl std::fmt::Display for AttachmentFileType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        use AttachmentFileType::*;
        let repr = match self {
            Png => "PNG",
            Jpeg => "JPEG",
        };
        write!(f, "{}", repr)
    }
}

impl FromStr for AttachmentFileType {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        use AttachmentFileType::*;
        match s {
            "PNG" => Ok(Png),
            "JPEG" => Ok(Jpeg),
            _ => Err(format!("Unsupported file type '{s}'")),
        }
    }
}
