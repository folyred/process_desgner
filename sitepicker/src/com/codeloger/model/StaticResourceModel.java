package com.codeloger.model;

import java.util.UUID;

public abstract class StaticResourceModel {
	
	private String fileName;
	private String url;
	
	public StaticResourceModel(String url) {
		super();
		this.fileName = UUID.randomUUID().toString() + getSuffix();
		this.url = url;
	}
	
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	
	public String getFilePath(){
		return savePath() + "/" + getFileName();
	}
	
	/**
	 * 获取保存路径
	 * @return
	 * String 
	 * @author wx
	 */
	public abstract String savePath();
	
	/**
	 * 获取后缀名
	 * @return
	 * String 
	 * @author wx
	 */
	public abstract String getSuffix();
	
	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		StaticResourceModel target = (StaticResourceModel)obj;
		return this.url.equals(target.getUrl());
	}

	@Override
	public int hashCode() {
		return this.url.hashCode();
	}
	
	
}
