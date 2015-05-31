require 'sinatra'
require 'sinatra/reloader' if development?
require 'pg'
require 'pry'
require 'sinatra/json'

get '/' do
  erb :index
end

get '/videos' do
  sql = "SELECT * FROM videos"
  @videos = run_sql(sql)
  if request.xhr?
    json @videos.to_a
  else
    erb :index
  end
end

get '/videos/new' do
  if request.xhr?
    json [{status: :ok}]
  else
    erb :index
  end
end

post '/videos' do
  sql = "INSERT INTO videos (title, description, url, genre) VALUES ('#{params['title']}', '#{params['description']}', '#{params['url']}', '#{params['genre']}') returning *"
  @video = run_sql(sql).first
  if request.xhr?
    json @video
  else
    redirect_to ('/items')
  end
end

get '/videos/:id' do
  sql = "SELECT * FROM videos WHERE id=#{params[:id]}"
  @video = run_sql(sql).first
  if request.xhr?
    json @video
  else
    redirect_to ('/items')
  end
end

get '/videos/:id/edit' do
  sql = "SELECT * FROM videos WHERE id=#{params[:id]}"
  @video = run_sql(sql).first
  erb :edit
end

post '/videos/:id' do
  sql = "UPDATE videos SET title = '#{params['title']}', description = '#{params['description']}', url = '#{params['url']}', genre = '#{params['genre']}' WHERE id=#{params[:id]}"
  run_sql(sql)
  redirect to ("/videos/#{params[:id]}")
end

delete '/videos/:id/delete' do
  sql = "DELETE FROM videos WHERE id=#{params[:id]}"
  run_sql(sql)
  redirect to ("/videos")
end


private

def run_sql(sql)
  conn = PG.connect(dbname: 'video_library', host: 'localhost')
  begin
    result = conn.exec(sql)
  ensure
    conn.close
  end
end